import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

interface WordDocumentViewerProps {
    documentUrl: string;
}

const WordDocumentViewer = ({ documentUrl }: WordDocumentViewerProps) => {
    const docs = [
        {
            uri: documentUrl,
            fileType: "doc",
            fileName: "document.doc",
        },
    ];

    return (
        documentUrl && (
            <div className='w-full h-full'>
                <DocViewer
                    documents={docs}
                    pluginRenderers={DocViewerRenderers}
                    className='w-full h-full doc-viewer-container'
                    style={{
                        height: "100%",
                        background: "transparent",
                    }}
                    config={{
                        header: {
                            disableHeader: true,
                            disableFileName: true,
                        },
                    }}
                />
            </div>
        )
    );
};

export default WordDocumentViewer;
