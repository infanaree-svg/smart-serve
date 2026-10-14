import type { MenuItem } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBaht } from "@/lib/format";
import { Pencil, Trash2 } from "lucide-react";

export interface MenuTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

/** Dense menu list: name, category badge, right-aligned price and row actions. */
export function MenuTable({ items, onEdit, onDelete }: MenuTableProps) {
  return (
    <Table data-ocid="menu.table">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="pl-4">ชื่อเมนู</TableHead>
          <TableHead>หมวดหมู่</TableHead>
          <TableHead className="text-right">ราคา</TableHead>
          <TableHead className="w-24 pr-4 text-right">จัดการ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow
            key={item.id.toString()}
            data-ocid={`menu.row.${index + 1}`}
          >
            <TableCell className="pl-4 font-medium text-foreground">
              {item.name}
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className="rounded-full font-medium text-muted-foreground"
              >
                {item.category}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-semibold tabular-nums text-foreground">
              {formatBaht(item.price)}
            </TableCell>
            <TableCell className="pr-4">
              <div className="flex items-center justify-end gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-primary"
                  aria-label={`แก้ไข ${item.name}`}
                  onClick={() => onEdit(item)}
                  data-ocid={`menu.edit_button.${index + 1}`}
                >
                  <Pencil className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  aria-label={`ลบ ${item.name}`}
                  onClick={() => onDelete(item)}
                  data-ocid={`menu.delete_button.${index + 1}`}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
