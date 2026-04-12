import { clsx } from 'clsx';
import { cloneElement, createContext, isValidElement, useContext, useId } from 'react';
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={clsx('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
};

const FormLabel = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => {
  const { formItemId } = useFormField();

  return (
    <label
      htmlFor={formItemId}
      className={clsx('text-sm font-medium leading-none text-ink peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
      {...props}
    />
  );
};

interface FormControlProps {
  children: React.ReactElement;
}

const FormControl = ({ children }: FormControlProps) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  const describedBy = !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`;

  if (!isValidElement(children)) {
    return null;
  }

  const childProps = children.props as { 'aria-describedby'?: string };
  const existingDescribed = childProps['aria-describedby'];
  const mergedDescribed = Array.from(
    new Set(
      [existingDescribed, describedBy]
        .filter(Boolean)
        .flatMap((value) => value!.split(/\s+/).filter(Boolean)),
    ),
  ).join(' ');

  return cloneElement(children, {
    id: formItemId,
    'aria-describedby': mergedDescribed,
    'aria-invalid': !!error,
  } as React.HTMLAttributes<HTMLElement>);
};

const FormDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      id={formDescriptionId}
      className={clsx('text-xs text-ink-faint', className)}
      {...props}
    />
  );
};

const FormMessage = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      id={formMessageId}
      className={clsx('text-xs font-medium text-status-error', className)}
      {...props}
    >
      {body}
    </p>
  );
};

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
