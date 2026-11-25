import type { ButtonHTMLAttributes } from "react"
import { Loader2 } from "lucide-react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

const Button = ({ type = "button", loading = false, disabled, className = "", children, ...rest }: ButtonProps) => {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  )
}

export default Button