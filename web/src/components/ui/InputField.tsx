import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Eye, EyeClosed } from "lucide-react"

type InputFieldProps = {
  label: string
  placeholder?: string
  isPasswordField?: boolean
  icon?: LucideIcon,
  value: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputField = ({ label, placeholder, icon: Icon, isPasswordField = false, value,onChange }: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="mb-2">
      <p className="mb-1">{label}</p>
      <div className="border border-[#64748B] bg-[#F8F9FD] flex gap-2 items-center rounded-xl px-3 py-2">
        {Icon && <Icon className="size-4 text-[#64748B]" />}
        <input
          className="w-full outline-none"
          type={isPasswordField && !showPassword ? "password" : "text"}
          placeholder={isPasswordField ? '••••••••':placeholder}
          value={value}
          onChange={onChange}
        />
        {isPasswordField && (
          <button className="cursor-pointer" type="button" onClick={() => setShowPassword((val) => !val)}>
            {showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
          </button>
        )}
      </div>
    </div>
  )
}

export default InputField