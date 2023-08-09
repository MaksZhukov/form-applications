import { Application } from '@/services/db/applications/types';
import { File } from '@/services/db/files/types';

export type ApiApplication = Application & { files: File[]; organization_name: string; uid: string };
