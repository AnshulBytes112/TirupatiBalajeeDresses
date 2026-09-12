import { DressLoadingBuffer } from "@/components/ui/dress-loading-buffer";
import { Container } from "@/components/layout/container";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-[75vh] bg-[#FAF7F2] flex items-center justify-center py-20">
      <Container>
        <DressLoadingBuffer size="lg" message="Loading certified school garment details..." />
      </Container>
    </div>
  );
}
