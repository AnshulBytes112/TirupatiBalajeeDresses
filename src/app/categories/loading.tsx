import { DressLoadingBuffer } from "@/components/ui/dress-loading-buffer";
import { Container } from "@/components/layout/container";

export default function CategoriesLoading() {
  return (
    <div className="min-h-[70vh] bg-[#FAF7F2] flex items-center justify-center py-16">
      <Container>
        <DressLoadingBuffer size="lg" message="Loading certified school categories..." />
      </Container>
    </div>
  );
}
