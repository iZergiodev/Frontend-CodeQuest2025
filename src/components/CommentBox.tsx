import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Image as ImageIcon, Sticker, Type } from "lucide-react";

type CommentBoxProps = {
    placeholder?: string;
    onSubmit?: (text: string) => void;
};

export function CommentBox({
    placeholder = "Únete a la conversación",
    onSubmit,
}: CommentBoxProps) {
    const [expanded, setExpanded] = useState(false);
    const [text, setText] = useState("");
    const ref = useRef<HTMLDivElement | null>(null);

    // Cerrar si clic fuera (solo si está vacío)
    useEffect(() => {
        const onDocPointer = (e: PointerEvent) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node) && text.trim() === "") {
                setExpanded(false);
            }
        };
        document.addEventListener("pointerdown", onDocPointer);
        return () => document.removeEventListener("pointerdown", onDocPointer);
    }, [text]);

    const disabled = text.trim() === "";

    const handleSubmit = () => {
        if (disabled) return;
        onSubmit?.(text.trim());
        setText("");
        setExpanded(false);
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <TooltipProvider delayDuration={150}>
            <div
                ref={ref}
                className={[
                    "transition-all",
                    expanded
                        ? "rounded-xl border bg-accent/20 p-3"
                        : "rounded-xl order px-5 py-2 hover:bg-muted/40",
                ].join(" ")}
                onClick={() => setExpanded(true)}
            >
                {!expanded ? (
                    <div className="text-muted-foreground select-none cursor-text ml">
                        {placeholder}
                    </div>
                ) : (
                    <>
                        <Textarea
                            autoFocus
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            placeholder={placeholder}
                            className="
                                !border-0 !border-transparent
                                !ring-0 !ring-offset-0
                                !outline-none focus:!outline-none focus-visible:!outline-none
                                !shadow-none
                                bg-transparent px-0
                                min-h-[40px] max-h-[50vh]
                            "
                        />

                        <div className="mt-3 flex items-center justify-between">
                            {/* Barra de herramientas */}
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 rounded-xl"
                                        // onClick={() => ... abrir file picker}
                                        >
                                            <ImageIcon className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Imagen</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 rounded-xl"
                                        // onClick={() => ... selector GIF}
                                        >
                                            {/* No hay icono "GIF" nativo en lucide; usamos Sticker o puedes reemplazar por texto */}
                                            <Sticker className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>GIF</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 rounded-xl"
                                        >
                                            <Type className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Formato de texto</TooltipContent>
                                </Tooltip>
                            </div>

                            {/* Acciones */}
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="rounded-xl bg-accent/60 hover:bg-accent"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setText("");
                                        setExpanded(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    disabled={disabled}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSubmit();
                                    }}
                                    className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                                >
                                    Comment
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </TooltipProvider>
    );
}
