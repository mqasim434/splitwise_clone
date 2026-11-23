import type { ButtonHTMLAttributes } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ type = "button", className = "", children, ...rest }: ButtonProps) => {
  return (
    <button
      {...rest}
      type={type}
      className={`w-full cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export default Button