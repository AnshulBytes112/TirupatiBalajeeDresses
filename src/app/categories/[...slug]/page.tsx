import DynamicCategoryPage, {
  generateMetadata as baseGenerateMetadata,
} from "@/app/category/[...slug]/page";

export const dynamic = "force-dynamic";

export const generateMetadata = baseGenerateMetadata;

export default DynamicCategoryPage;
