import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { updateSegment } from "@/lib/actions/admin";
import type { Segment } from "@/lib/data/admin";
import { ActionForm, SubmitButton } from "./action-form";

/** RFM cashback rates per customer segment (FS-11.5) → customer_segment. */
export function RfmTab({ segments }: { segments: Segment[] }) {
  return (
    <section className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">
        Cashback rate applied at completion, by segment. Enter a fraction (e.g. 0.05 = 5%).
        Segments are re-computed nightly.
      </p>
      {segments.map((seg) => (
        <Card key={seg.id}>
          <CardContent className="py-3">
            <ActionForm action={updateSegment} className="flex items-end gap-2">
              <input type="hidden" name="id" value={seg.id} />
              <div className="flex-1">
                <div className="text-sm font-medium">{seg.name}</div>
                <div className="text-xs text-muted-foreground">
                  rank {seg.rank} · currently {Math.round(seg.cashback_rate * 100)}%
                </div>
              </div>
              <Input
                name="cashbackRate"
                type="number"
                step="0.01"
                min="0"
                max="1"
                defaultValue={String(seg.cashback_rate)}
                aria-label={`Cashback rate for ${seg.name}`}
                className="w-24"
              />
              <SubmitButton variant="secondary">Save</SubmitButton>
            </ActionForm>
          </CardContent>
        </Card>
      ))}
      {segments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No segments defined.</p>
      ) : null}
    </section>
  );
}
