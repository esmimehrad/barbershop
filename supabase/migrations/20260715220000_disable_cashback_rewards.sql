-- Disable RFM/cashback awards without rewriting the unversioned completion
-- trigger. Existing ledger rows remain immutable financial history; all future
-- cashback rates are zeroed and cashback ledger inserts are suppressed.

update public.customer_segment
set cashback_rate = 0
where cashback_rate <> 0;

update public.service
set cashback_rate = null
where cashback_rate is not null;

update public.credit_policy
set default_cashback_rate = 0
where default_cashback_rate <> 0;

create or replace function public.skip_cashback_credit_transaction()
returns trigger
language plpgsql
as $$
begin
  if new.reason = 'cashback' then
    return null;
  end if;

  return new;
end;
$$;

drop trigger if exists skip_cashback_credit_transaction on public.credit_transaction;

create trigger skip_cashback_credit_transaction
before insert on public.credit_transaction
for each row execute function public.skip_cashback_credit_transaction();
