export default function RestaurantCard({ restaurant }) {
  return (
    <div className="restaurant-card">
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