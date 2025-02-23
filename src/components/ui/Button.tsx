'use client'

// Se establece una interfaz Button añadiendo propiedades extras
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  className?: string,
}

const Button: React.FunctionComponent<ButtonProps> = ({
  variant = "primary",
  className = "",
  size = "medium",
  ...rest
}) => {

    // Estilización del botón en  sus estados: Default, Hover, Focus, Disabled
    const baseStyles = "text-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer inline-flex items-center justify-center outline-none disabled:bg-gray-300 disabled:cursor-default";
    
  const sizes = {
    small: "w-20",

    medium: "w-40",

    large: "w-60",
  }

    const variants = {
      primary: "bg-black text-white hover:bg-gray-900 focus-visible:ring-2 ring-black focus:ring-offset-2 focus:scale-[0.98] dark:bg-gray-700 dark:text-sky-100 dark:hover:bg-gray-500 dark:ring-gra-700 focus:scale-[0.98]",

      secondary: "bg-transparent border border-black text-black hover:bg-gray-50 focus-visible:ring-2 ring-black focus:ring-offset-2 focus:scale-[0.98] dark:border-sky-100 dark:text-sky-100 dark:hover:bg-gray-500 ring-sky-100",

      tertiary: "bg-white rounded-none text-black hover:bg-gray-100 focus:ring-black focus:ring-2 dark:bg-gray-700 dark:text-sky-100",
    };

  
    return (
      <button 
        className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
        {...rest}
      >
      </button>
    );
  }
  

  export default Button