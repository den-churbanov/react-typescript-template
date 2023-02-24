export type TableCellValidationMessage = string | null;
export type CellValidator<T> = (value?: T) => TableCellValidationMessage;

interface ValidationResult {
  message: string,
  isValid: boolean
}

const defaultValidator: CellValidator<any> = (_: unknown) => null;

export const useTableCellValidator = <T>(value: T, validator: CellValidator<T> = defaultValidator): ValidationResult => {
  const message = validator(value);

  return {
    message,
    isValid: !Boolean(message)
  }
}