import { usePage } from '@inertiajs/react';

export interface SectionContent {
    title: string;
    highlight: string;
    description: string;
    [key: string]: any;
}

export class ContentService {
    private contentData: Record<string, Record<string, SectionContent>>;

    constructor(contentData: Record<string, Record<string, SectionContent>> = {}) {
        this.contentData = contentData;
    }

    /**
     * Dapatkan seluruh section dari sebuah halaman
     */
    getPage(page: string): Record<string, SectionContent> {
        return this.contentData[page] || {};
    }

    /**
     * Dapatkan data section spesifik pada halaman tertentu
     */
    getSection(page: string, section: string): SectionContent {
        return (
            this.contentData[page]?.[section] || {
                title: '',
                highlight: '',
                description: '',
            }
        );
    }

    /**
     * Alias method `section(page, section)` untuk sintaks ringkas:
     * const hero = content.section('home', 'hero');
     */
    section(page: string, section: string): SectionContent {
        return this.getSection(page, section);
    }

    /**
     * Helper untuk mengambil field tertentu dari sebuah section
     * contoh: content.get('home', 'hero', 'title');
     */
    get(page: string, section: string, field: string): string {
        const sec = this.getSection(page, section);
        return sec?.[field] ?? '';
    }
}

/**
     Helper function untuk membuat instance ContentService secara manual
 */
export function createContentService(data: Record<string, Record<string, SectionContent>> = {}) {
    return new ContentService(data);
}

/**
 * Hook React untuk langsung mengakses ContentService dari props Inertia
 */
export function useContent(): ContentService {
    const props = usePage().props as any;
    const pageContent = props.pageContent || {};
    return new ContentService(pageContent);
}
