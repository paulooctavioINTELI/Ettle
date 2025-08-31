/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";

export function ShortAnswerField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-[var(--radius-soft)] bg-[#2A2A2F] px-4 py-3 text-white placeholder:text-[var(--color-muted)] outline-none ring-1 ring-white/10 focus:ring-[var(--color-primary)]"
    />
  );
}

export function ParagraphField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      rows={5}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-[var(--radius-soft)] bg-[#2A2A2F] px-4 py-3 text-white placeholder:text-[var(--color-muted)] outline-none ring-1 ring-white/10 focus:ring-[var(--color-primary)]"
    />
  );
}

export function DropdownField({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-[var(--radius-soft)] bg-[#2A2A2F] px-4 py-3 text-white outline-none ring-1 ring-white/10 focus:ring-[var(--color-primary)]"
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export function MultipleChoiceField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3">
          <input
            type="radio"
            name="mc"
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

export function CheckboxField({
  value,
  onChange,
  options,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options: string[];
}) {
  function toggle(choice: string) {
    if (value.includes(choice)) onChange(value.filter((c) => c !== choice));
    else onChange([...value, choice]);
  }
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3">
          <input
            type="checkbox"
            value={opt}
            checked={value.includes(opt)}
            onChange={() => toggle(opt)}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

export function PhoneNumberField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [local, setLocal] = useState<string>(value || "");

  useEffect(() => {
    setLocal((prev) => (prev !== value ? (value || "") : prev));
  }, [value]);

  const valid = local ? isValidPhoneNumber(local) : false;

  return (
    <div className="w-full">
      <PhoneInput
        defaultCountry="gb"
        value={local}
        onChange={(v) => {
          const next = v || "";
          setLocal(next);
          onChange(next);
        }}
        className="w-full"
        inputClassName="w-full rounded-[var(--radius-soft)] bg-[#2A2A2F] px-4 py-3 text-white outline-none ring-1 ring-white/10 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-muted)]"
        countrySelectorStyleProps={{
          className: "rounded-[var(--radius-soft)] bg-[#2A2A2F] ring-1 ring-white/10",
          buttonClassName:
            "h-full w-auto px-3 py-3 text-white hover:bg-white/5 rounded-[var(--radius-soft)]",
          dropdownArrowClassName:
            "max-h-72 overflow-auto bg-[#1f1f23] text-white ring-1 ring-white/10 rounded-[var(--radius-soft)]",
        }}
        inputProps={{
          placeholder: placeholder || "Enter your phone number",
          name: "phone",
          autoComplete: "tel",
          "aria-invalid": !!local && !valid,
        }}
        forceDialCode
        showDisabledDialCodeAndPrefix
      />

      <div className="mt-2 text-xs">
        {local ? (
          <span className={valid ? "text-emerald-400/90" : "text-red-400/90"}>
            {valid ? "Valid number" : "Please enter a valid number"}
          </span>
        ) : (
          <span className="text-[var(--color-muted)]">
            Include country code. Example: +44 7123 456789
          </span>
        )}
      </div>
    </div>
  );
}
