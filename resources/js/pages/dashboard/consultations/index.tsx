import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { MessageSquare, Paperclip, X, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Consultation {
    id: number;
    name: string;
    description: string;
    attachment_path: string | null;
    response: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedConsultations {
    data: Consultation[];
    links: PaginationLink[];
    total: number;
}

interface ConsultationsIndexProps {
    consultations: PaginatedConsultations;
}

export default function ConsultationsIndex({ consultations }: ConsultationsIndexProps) {
    const [responses, setResponses] = useState<Record<number, string>>({});
    const [submittingId, setSubmittingId] = useState<number | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleResponseChange = (id: number, val: string) => {
        setResponses((prev) => ({ ...prev, [id]: val }));
    };

    const handleSaveResponse = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        setSubmittingId(id);
        const text = responses[id] ?? '';

        router.post(
            `/dashboard/konsultasi/${id}/response`,
            { response: text },
            {
                onFinish: () => setSubmittingId(null),
            }
        );
    };

    const isImageFile = (path: string | null) => {
        if (!path) return false;
        const lower = path.toLowerCase();
        return (
            lower.endsWith('.jpg') ||
            lower.endsWith('.jpeg') ||
            lower.endsWith('.png') ||
            lower.endsWith('.webp')
        );
    };

    return (
        <>
            <Head title="Daftar Konsultasi Masuk" />
            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Daftar Konsultasi Publik
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Tinjau aspirasi masyarakat dan berikan tanggapan resmi dari partai.
                    </p>
                </div>

                {consultations.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            Belum ada konsultasi yang masuk.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {consultations.data.map((item) => {
                            const isImg = isImageFile(item.attachment_path);
                            const attachmentUrl = item.attachment_path
                                ? `/storage/${item.attachment_path}`
                                : null;

                            return (
                                <Card key={item.id} className="overflow-hidden">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold text-foreground">
                                                    {item.name}
                                                </h3>
                                                <Badge
                                                    variant={item.response ? 'default' : 'secondary'}
                                                    className={item.response ? 'bg-emerald-600' : ''}
                                                >
                                                    {item.response ? 'Sudah Ditanggapi' : 'Belum Ditanggapi'}
                                                </Badge>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(item.created_at).toLocaleString('id-ID')}
                                            </span>
                                        </div>

                                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                                            {item.description}
                                        </p>

                                        {/* Attachment */}
                                        {attachmentUrl && (
                                            <div className="pt-1">
                                                {isImg ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewImage(attachmentUrl)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                                                    >
                                                        <Paperclip className="size-3.5 text-muted-foreground" />
                                                        Lihat Lampiran Gambar
                                                    </button>
                                                ) : (
                                                    <a
                                                        href={attachmentUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                                                    >
                                                        <Paperclip className="size-3.5 text-muted-foreground" />
                                                        Buka File Dokumen (PDF)
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        {/* Existing Response */}
                                        {item.response && (
                                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-200">
                                                <div className="flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300 mb-1">
                                                    <CheckCircle2 className="size-3.5" />
                                                    Respon yang telah dikirim:
                                                </div>
                                                <p className="whitespace-pre-wrap">{item.response}</p>
                                            </div>
                                        )}

                                        {/* Response Form */}
                                        <form
                                            onSubmit={(e) => handleSaveResponse(e, item.id)}
                                            className="space-y-3 pt-2 border-t border-border"
                                        >
                                            <textarea
                                                rows={3}
                                                value={responses[item.id] ?? item.response ?? ''}
                                                onChange={(e) =>
                                                    handleResponseChange(item.id, e.target.value)
                                                }
                                                placeholder="Tuliskan respon atau tanggapan resmi..."
                                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            />
                                            <div className="flex justify-end">
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    disabled={submittingId === item.id}
                                                    className="bg-[#b3181f] text-white hover:bg-[#99141b]"
                                                >
                                                    {submittingId === item.id && (
                                                        <Loader2 className="mr-2 size-3.5 animate-spin" />
                                                    )}
                                                    Simpan Respon
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {/* Pagination */}
                        {consultations.links && consultations.links.length > 3 && (
                            <div className="flex flex-wrap justify-center gap-1.5 pt-4">
                                {consultations.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-border px-3 text-xs text-muted-foreground opacity-50"
                                            />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-xs font-medium transition-colors ${link.active
                                                    ? 'bg-[#b3181f] text-white shadow'
                                                    : 'border border-border bg-background text-foreground hover:bg-muted'
                                                }`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Lightbox Modal for Attachment */}
                <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
                    <DialogContent className="max-w-3xl p-2 bg-transparent border-none shadow-none">
                        {previewImage && (
                            <div className="relative overflow-hidden rounded-xl bg-black/80 p-2">
                                <img
                                    src={previewImage}
                                    alt="Lampiran"
                                    className="max-h-[80vh] w-full object-contain rounded-lg"
                                />
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
