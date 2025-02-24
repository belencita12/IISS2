'use client'

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement>{
  className?: string,
  type?: string,
}

const Button: React.FunctionComponent<IInputProps> = ({
  className = "",
  type,
  ...props
}) => {

    const baseStyle = "h-9 w-full px-3 py-2 rounded-md bg-white border border-gray-200 text-zinc-500 transition-all duration-200 outline-none disabled:bg-gray-200 disabled:text-zinc-400 disabled:cursor-default focus:ring-2 focus:ring-gray-300";

    return (
      <input 
        className={`${baseStyle} ${className}`}
        {...props}
        type={`${type}`}
      />
    );
  }
  

  export default Button