-- Relax access policy for materiais table to allow public access (consistent with other tables in this dev phase)
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.materiais;

CREATE POLICY "Allow public all on materiais"
ON public.materiais
FOR ALL
USING (true);
