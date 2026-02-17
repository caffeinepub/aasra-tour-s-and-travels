import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob, Variant_cab_driver, type Attachment } from '../backend';

export function useGetCallerAttachment(attachmentType: Variant_cab_driver) {
  const { actor, isFetching } = useActor();

  return useQuery<Attachment | null>({
    queryKey: ['attachment', attachmentType],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerAttachment(attachmentType);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadAttachment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      attachmentType,
      file,
      name,
      contentType,
      onProgress,
    }: {
      attachmentType: Variant_cab_driver;
      file: Uint8Array;
      name: string;
      contentType: string;
      onProgress?: (percentage: number) => void;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Create a new ArrayBuffer and Uint8Array to ensure proper typing
      const newBuffer = new ArrayBuffer(file.length);
      const newArray = new Uint8Array(newBuffer);
      newArray.set(file);
      
      let blob = ExternalBlob.fromBytes(newArray);
      if (onProgress) {
        blob = blob.withUploadProgress(onProgress);
      }
      
      return actor.uploadAttachment(attachmentType, blob, name, contentType);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attachment', variables.attachmentType] });
    },
  });
}
