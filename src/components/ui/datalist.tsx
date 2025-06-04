import * as React from "react"

import { cn } from "@/lib/utils"

interface DataListProps extends React.InputHTMLAttributes<HTMLInputElement> {
    datas?: { text: string; value: string }[];
    handleSelect?: (value: string) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
    handleReset?: () => void;
}

const DataList = ({ className, handleSelect, datas, placeholder, onChange, handleReset, ...props }:DataListProps) => {
    const [isShown, setIsShown] = React.useState(false);
    return (
        <div className="relative w-full overflow-visible">
            <input
                placeholder={placeholder}
                onFocus={() => {setIsShown(true)}}
                onChange={(e) => {
                    if (e.target.value.length > 0) {
                        setIsShown(true);
                    } else {
                        setIsShown(false);
                    }
                    onChange && onChange(e.target.value);
                }}
                {...props}
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    className
                )}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-30 cursor-pointer" onClick={() => {
                setIsShown(!isShown);
                handleReset && handleReset();}} >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 11-8 0 4 4 0 018 0zM12 6v6m0 0h6m-6 0H6"></path>
                </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-px cursor-pointer z-30">
                {datas && isShown && (datas.length > 0? datas.map((item, index) => 
                    <div onClick={()=>{
                        handleSelect && handleSelect(item.value)
                        //console.log("Selected:", item);
                        onChange && onChange(item.text);
                        setIsShown(false);
                    }}
                    key={index}
                    className="px-3 py-2 hover:brightness-95 bg-white cursor-pointer text-sm text-gray-700"
                    >
                        {item.text}
                    </div>
                ):
                <div className="px-3 py-2 text-sm text-gray-500">
                    No hay datos disponibles
                </div>)
                }
            </div>
        </div>
    )
  }

DataList.displayName = "DataList"

export { DataList }
