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
interface Props {
    value: string;
    editorRef?: Ref<MDXEditorMethods> | null;
    onChange: (value: string) => void;
    placeholder?: string;
}
const MarkdownEditor = ({  value,
                            onChange,
                            editorRef,
                            placeholder }: Props) => {
    return (
        <MDXEditor
            markdown={value}
            ref={editorRef}
            onChange={onChange}
            placeholder={placeholder}
            className="background-light800_dark200 light-border-2 markdown-editor dark-editor grid w-full border"
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
    );
};
export default MarkdownEditor;