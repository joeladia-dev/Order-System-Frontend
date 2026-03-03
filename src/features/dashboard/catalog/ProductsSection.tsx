import { Package } from "lucide-react";
import type { Product } from "../../../lib/api";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { tokenHasAdminRole } from "../selectors";
import type { DashboardController } from "../useDashboardController";

type ProductsSectionProps = {
  controller: DashboardController;
};

export function ProductsSection({ controller }: ProductsSectionProps) {
  const hasAdminAccess =
    controller.hasAdminSession || tokenHasAdminRole(controller.adminToken);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5 text-primary" />
          Products & Inventory
        </CardTitle>
        <CardDescription>
          Browse products and manage catalog with admin privileges.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="rounded-md border border-border/70 bg-background/75 px-3 py-2 text-xs text-muted-foreground">
          Fields marked with{" "}
          <span className="font-medium text-foreground">*</span> are required
          for catalog updates.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={controller.loadProducts}
            disabled={controller.isBusy}
            variant="secondary"
            type="button"
          >
            Refresh Products
          </Button>
        </div>

        {controller.products.length === 0 ? (
          <div className="rounded-md border border-border px-3 py-4 text-center text-sm text-muted-foreground">
            No products loaded yet.
          </div>
        ) : (
          <>
            <div className="grid gap-3 md:hidden">
              {controller.products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg border border-border/80 bg-card/70 p-3"
                >
                  <p className="text-sm font-medium text-foreground">
                    {product.name}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">ID:</span>{" "}
                      {product.id}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Stock:
                      </span>{" "}
                      {product.stock}
                    </p>
                    <p className="col-span-2">
                      <span className="font-medium text-foreground">
                        Price:
                      </span>{" "}
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3 w-full"
                    onClick={() => controller.selectProductForEdit(product)}
                    disabled={controller.isBusy || !hasAdminAccess}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-2 w-full"
                    onClick={() => controller.archiveProduct(product.id)}
                    disabled={controller.isBusy || !hasAdminAccess}
                  >
                    Archive
                  </Button>
                </div>
              ))}
            </div>

            <div
              className={`hidden rounded-md border border-border md:block ${controller.products.length >= 10 ? "max-h-[28rem] overflow-y-auto" : "overflow-hidden"}`}
            >
              <table className="w-full text-sm">
                <thead className="bg-muted/70 text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">ID</th>
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">Price</th>
                    <th className="px-3 py-2 text-left font-medium">Stock</th>
                    <th className="px-3 py-2 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {controller.products.map((product) => (
                    <tr key={product.id} className="border-t border-border/80">
                      <td className="px-3 py-2">{product.id}</td>
                      <td className="px-3 py-2">{product.name}</td>
                      <td className="px-3 py-2">${product.price.toFixed(2)}</td>
                      <td className="px-3 py-2">{product.stock}</td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              controller.selectProductForEdit(product)
                            }
                            disabled={controller.isBusy || !hasAdminAccess}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              controller.archiveProduct(product.id)
                            }
                            disabled={controller.isBusy || !hasAdminAccess}
                          >
                            Archive
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={controller.createProduct}
        >
          <div className="space-y-1.5">
            <label
              htmlFor="product-create-id"
              className="text-xs font-medium text-muted-foreground"
            >
              Product ID <span className="text-primary">*</span>
            </label>
            <Input
              id="product-create-id"
              value={controller.newProduct.id}
              onChange={(e) =>
                controller.setNewProduct((prev: Product) => ({
                  ...prev,
                  id: e.target.value,
                }))
              }
              placeholder="Product ID"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="product-create-name"
              className="text-xs font-medium text-muted-foreground"
            >
              Product Name <span className="text-primary">*</span>
            </label>
            <Input
              id="product-create-name"
              value={controller.newProduct.name}
              onChange={(e) =>
                controller.setNewProduct((prev: Product) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Product name"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="product-create-price"
              className="text-xs font-medium text-muted-foreground"
            >
              Price <span className="text-primary">*</span>
            </label>
            <Input
              id="product-create-price"
              value={controller.newProduct.price}
              onChange={(e) =>
                controller.setNewProduct((prev: Product) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
              placeholder="Price"
              type="number"
              min={0}
              step="0.01"
              required
            />
            <p className="text-[11px] text-muted-foreground">
              Use a decimal value (for example, 19.99).
            </p>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="product-create-stock"
              className="text-xs font-medium text-muted-foreground"
            >
              Stock <span className="text-primary">*</span>
            </label>
            <Input
              id="product-create-stock"
              value={controller.newProduct.stock}
              onChange={(e) =>
                controller.setNewProduct((prev: Product) => ({
                  ...prev,
                  stock: Number(e.target.value),
                }))
              }
              placeholder="Stock"
              type="number"
              min={0}
              required
            />
          </div>
          <Button
            disabled={controller.isBusy || !hasAdminAccess}
            type="submit"
            className="md:col-span-2"
          >
            Create Product
          </Button>
        </form>

        <form
          className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
          onSubmit={controller.updateStock}
        >
          <div className="space-y-1.5">
            <label
              htmlFor="product-update-id"
              className="text-xs font-medium text-muted-foreground"
            >
              Product ID <span className="text-primary">*</span>
            </label>
            <Input
              id="product-update-id"
              value={controller.stockUpdate.productId}
              readOnly
              placeholder="Product ID"
              required
            />
            <p className="text-[11px] text-muted-foreground">
              View only. Select a product from the list to change the target ID.
            </p>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="product-update-stock"
              className="text-xs font-medium text-muted-foreground"
            >
              New Stock <span className="text-primary">*</span>
            </label>
            <Input
              id="product-update-stock"
              value={controller.stockUpdate.stock}
              onChange={(e) =>
                controller.setStockUpdate((prev) => ({
                  ...prev,
                  stock: Number(e.target.value),
                }))
              }
              type="number"
              min={0}
              placeholder="New stock"
              required
            />
          </div>
          <Button
            disabled={controller.isBusy || !hasAdminAccess}
            type="submit"
            className="md:self-end"
          >
            Update
          </Button>
        </form>

        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={controller.updateExistingProduct}
        >
          {!controller.editProduct ? (
            <div className="md:col-span-2 rounded-md border border-border px-3 py-3 text-sm text-muted-foreground">
              Select a product from the list above to edit it.
            </div>
          ) : null}
          <div className="space-y-1.5 md:col-span-2">
            <label
              htmlFor="product-edit-id"
              className="text-xs font-medium text-muted-foreground"
            >
              Product ID
            </label>
            <Input
              id="product-edit-id"
              value={controller.editProduct?.id ?? ""}
              disabled
              placeholder="No product selected"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="product-edit-name"
              className="text-xs font-medium text-muted-foreground"
            >
              Product Name <span className="text-primary">*</span>
            </label>
            <Input
              id="product-edit-name"
              value={controller.editProduct?.name ?? ""}
              onChange={(e) =>
                controller.setEditProduct((prev: Product | null) =>
                  prev
                    ? {
                        ...prev,
                        name: e.target.value,
                      }
                    : prev,
                )
              }
              disabled={!controller.editProduct}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="product-edit-price"
              className="text-xs font-medium text-muted-foreground"
            >
              Price <span className="text-primary">*</span>
            </label>
            <Input
              id="product-edit-price"
              value={controller.editProduct?.price ?? ""}
              onChange={(e) =>
                controller.setEditProduct((prev: Product | null) =>
                  prev
                    ? {
                        ...prev,
                        price: Number(e.target.value),
                      }
                    : prev,
                )
              }
              type="number"
              min={0}
              step="0.01"
              disabled={!controller.editProduct}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="product-edit-stock"
              className="text-xs font-medium text-muted-foreground"
            >
              Stock <span className="text-primary">*</span>
            </label>
            <Input
              id="product-edit-stock"
              value={controller.editProduct?.stock ?? ""}
              onChange={(e) =>
                controller.setEditProduct((prev: Product | null) =>
                  prev
                    ? {
                        ...prev,
                        stock: Number(e.target.value),
                      }
                    : prev,
                )
              }
              type="number"
              min={0}
              disabled={!controller.editProduct}
              required
            />
          </div>
          <Button
            disabled={
              controller.isBusy || !controller.editProduct || !hasAdminAccess
            }
            type="submit"
            className="md:self-end"
          >
            Save Product Changes
          </Button>
        </form>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Archived Products
          </h3>
          {controller.archivedProducts.length === 0 ? (
            <div className="rounded-md border border-border px-3 py-4 text-center text-sm text-muted-foreground">
              No archived products.
            </div>
          ) : (
            <div className="space-y-2">
              {controller.archivedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-3 rounded-md border border-border p-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="text-sm">
                    <p className="font-medium text-foreground">
                      {product.name}
                    </p>
                    <p className="text-muted-foreground">
                      {product.id} · ${product.price.toFixed(2)} · Stock{" "}
                      {product.stock}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => controller.restoreProduct(product.id)}
                      disabled={controller.isBusy || !hasAdminAccess}
                    >
                      Restore
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        controller.deleteProductPermanently(product.id)
                      }
                      disabled={controller.isBusy || !hasAdminAccess}
                    >
                      Delete Permanently
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
