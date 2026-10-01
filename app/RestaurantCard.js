
import { useRouter } from "next/navigation";

export default function RestaurantCard({ restaurant }) {
  {/**페이지 이동을 위한 라우터 */ }
  const router = useRouter();
  return (
    <div className="restaurant-card"
      onClick={() => {
        router.push(`/review?id=${restaurant.id}`)  //코드를 실행해서 다른 URL로 이동시킨다.
      }}>
      <div className="restaurant-image">
        {restaurant.image && (
          <img src={restaurant.image} alt={restaurant.name} />
        )}
        <span className="category-badge">{restaurant.category}</span>
      </div>

      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>
        <p className="restaurant-menu">{restaurant.representativeMenu}</p>

        <div className="restaurant-row">
          <p className="restaurant-price">{restaurant.price}원</p>
          <div className="restaurant-rating">
            <p>{restaurant.rating !== null ? `⭐ ${restaurant.rating.toFixed(1)}` : "☆ 0.0"}</p>
          </div>
        </div>

        <div className="review-row">
          <div className="latest-review">
            <p>{restaurant.latestReview ? `"${restaurant.latestReview.content}"` : "리뷰 없음"}</p>
          </div>
          <p className="restaurant-distance">{restaurant.distance}m</p>
        </div>
      </div>
    </div>
  );
}