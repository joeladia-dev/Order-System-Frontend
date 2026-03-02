param(
    [string]$ApiRoot = "..\Order-System-API",
    [switch]$RemoveVolumes,
    [switch]$StopLocalApiProcesses
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendRoot = Resolve-Path (Join-Path $scriptRoot "..")
$apiRootResolved = Resolve-Path (Join-Path $frontendRoot $ApiRoot)
$apiStopScript = Join-Path $apiRootResolved "scripts\stop-full-stack.ps1"

if (-not (Test-Path $apiStopScript)) {
    throw "Could not find API stop script at $apiStopScript"
}

$command = "& '$apiStopScript'"
if ($RemoveVolumes) {
    $command += " -RemoveVolumes"
}
if ($StopLocalApiProcesses) {
    $command += " -StopLocalApiProcesses"
}

powershell -ExecutionPolicy Bypass -Command $command
