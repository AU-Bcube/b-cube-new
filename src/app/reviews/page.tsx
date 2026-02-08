import { getInterviews, getPhotos } from "@/actions/data";
import Banner from "@/components/ui/Banner";
import ReviewTabs from "@/features/reviews/ReviewTabs";

export default async function ReviewsPage() {
  const [interviews, photos] = await Promise.all([
    getInterviews(),
    getPhotos(),
  ]);

  return (
    <main>
      <Banner
        title={
          <>
            B-CUBE의 생생한 후기들을
            <br />
            지금 확인해 보세요
          </>
        }
        description="선배들의 인터뷰와 활동 사진을 확인해 보세요."
      />
      <ReviewTabs interviews={interviews} photos={photos} />
    </main>
  );
}
