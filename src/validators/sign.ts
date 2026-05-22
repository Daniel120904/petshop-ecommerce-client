import { z } from 'zod';

// ── Helpers ──────────────────────────────────────────────
const toPascalCase = (str: string) =>
  str
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

// ── Validators individuais ───────────────────────────────
export const validatePassword = () =>
  z.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Deve conter pelo menos um caractere especial');

export const validateCpf = () =>
  z.string()
    .transform((val) => val.replace(/\D/g, ''))
    .pipe(z.string().length(11, 'CPF deve ter 11 dígitos'));

export const validateBirthday = (minAge: number) =>
  z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
    .refine((val) => {
      const [year, month, day] = val.split('-').map(Number);
      const birth = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age >= minAge;
    }, `Idade mínima é ${minAge} anos`);

export const coerceId = (label: string) =>
  z.coerce
    .number({ error: `${label} é obrigatório` })
    .positive(`Selecione um ${label}`);

// ── Schema completo ──────────────────────────────────────
export const cadastroSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: validatePassword(),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').transform(toPascalCase),
  cpf: validateCpf(),
  birthday: validateBirthday(5),
  genderId: coerceId('Gênero'),
});

export type CadastroSchema = z.infer<typeof cadastroSchema>;

// ── Mapa de schemas por campo (para validação individual no onBlur) ──
const fieldSchemaMap = {
  name:     z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email:    z.string().email('E-mail inválido'),
  password: validatePassword(),
  cpf:      validateCpf(),
  birthday: validateBirthday(5),
  genderId: coerceId('Gênero'),
} satisfies Partial<Record<keyof CadastroSchema, z.ZodTypeAny>>;

// ── Função de validação individual ──────────────────────
export function validateField(
  field: keyof typeof fieldSchemaMap,
  value: unknown
): string | null {
  const result = fieldSchemaMap[field].safeParse(value);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? 'Valor inválido';
}