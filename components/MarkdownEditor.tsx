"use client";

import React from 'react';
import {
    MDXEditor,
    UndoRedo,
    BoldItalicUnderlineToggles,
    toolbarPlugin,
    CodeToggle,
    headingsPlugin,
    listsPlugin,
    linkPlugin,
    quotePlugin,
    markdownShortcutPlugin,
    ListsToggle,
    linkDialogPlugin,
    CreateLink,
    InsertImage,
    InsertTable,
    tablePlugin,
    imagePlugin,
    ConditionalContents,
    Separator,
    MDXEditorMethods,
} from "@mdxeditor/editor";
import { Ref } from "react";
import "@mdxeditor/editor/style.css";
import { limitText } from "@/lib/textLimits";
interface Props {
    value: string;
    editorRef?: Ref<MDXEditorMethods> | null;
    onChange: (value: string) => void;
    placeholder?: string;
    preview?: string;
    maxLength?: number;
    showCounter?: boolean;
}
const MarkdownEditor = ({  value,
                            onChange,
                            editorRef,
                            placeholder,
                            maxLength,
                            showCounter = false }: Props) => {
    const isFirstChangeRef = React.useRef(true);
    const initialValueRef = React.useRef(value);
    
    const handleChange = (nextValue: string) => {
        // MDXEditor often calls onChange on mount when it normalizes the markdown.
        // We want to ignore this first call if it's just normalization.
        if (isFirstChangeRef.current) {
            isFirstChangeRef.current = false;
            // If the only difference is whitespace/newlines, ignore it
            if (nextValue.trim() === initialValueRef.current?.trim()) {
                return;
            }
        }
        
        onChange(nextValue);
    };

    const currentLength = value?.length || 0;
    const isOverLimit = typeof maxLength === "number" && maxLength >= 0 && currentLength > maxLength;

    return (
        <div className="space-y-1">
            <MDXEditor
                markdown={value}
                ref={editorRef}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full border rounded-md bg-base-100 text-base-content"
                plugins={[
                    headingsPlugin(),
                    listsPlugin(),
                    linkPlugin(),
                    linkDialogPlugin(),
                    quotePlugin(),
                    markdownShortcutPlugin(),
                    tablePlugin(),
                    imagePlugin(),
                    toolbarPlugin({
                        toolbarContents: () => (
                            <ConditionalContents
                                options={[
                                    {
                                        fallback: () => (
                                            <>
                                                <UndoRedo />
                                                <Separator />
                                                <BoldItalicUnderlineToggles />
                                                <CodeToggle />
                                                <Separator />
                                                <ListsToggle />
                                                <Separator />
                                                <CreateLink />
                                                <InsertImage />
                                                <Separator />
                                                <InsertTable />
                                                <Separator />
                                            </>
                                        ),
                                    },
                                ]}
                            />
                        ),
                    }),
                ]}
            />
            {showCounter && typeof maxLength === "number" && maxLength >= 0 && (
                <div className={`text-xs text-right ${isOverLimit ? "text-error" : "text-base-content/50"}`}>
                    {currentLength}/{maxLength}
                </div>
            )}
        </div>
    );
};
export default MarkdownEditor;