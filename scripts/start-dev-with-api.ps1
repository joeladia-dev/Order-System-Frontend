param(
    [string]$ApiRoot = "..\Order-System-API",
    [switch]$NoBuild,
    [switch]$SkipHealthChecks
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendRoot = Resolve-Path (Join-Path $scriptRoot "..")
$apiRootResolved = Resolve-Path (Join-Path $frontendRoot $ApiRoot)
$apiStartScript = Join-Path $apiRootResolved "scripts\start-full-stack.ps1"

if (-not (Test-Path $apiStartScript)) {
    throw "Could not find API starter script at $apiStartScript"
}

$command = "& '$apiStartScript' -FrontendRoot '..\Order-System-Frontend'"
if ($NoBuild) {
    $command += " -NoBuild"
}
if ($SkipHealthChecks) {
    $command += " -SkipHealthChecks"
}

powershell -ExecutionPolicy Bypass -Command $command
