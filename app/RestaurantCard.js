
import { useRouter } from "next/navigation"; 

export default function RestaurantCard({ restaurant }) {
  {/**페이지 이동을 위한 라우터 */}
  const router = useRouter();
  return (
    <div className="restaurant-card"
        onClick={() => {
          router.push(`/review?id=${restaurant.id}`)  //코드를 실행해서 다른 URL로 이동시킨다.
        }}>
    <div className="restaurant-image"></div>

    <div className="restaurant-info">
      <h3>{restaurant.name}</h3>
      <p>{restaurant.category}</p>
      <p>{restaurant.distance}m</p>
      <p>{restaurant.representativeMenu}</p>
      <p>{restaurant.price}원</p>
      <p>{restaurant.rating !== null ? `⭐ ${restaurant.rating}` : "리뷰 없음"}</p>
    </div>
    </div>
  );
}