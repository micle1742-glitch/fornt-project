'use client'

import { useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import { useQuery } from "@tanstack/react-query"
import ReviewForm from "./ReviewForm";

export default function Home() {
  const { data, isLoading, isError } = useQuery({

    queryKey: ["restaurants"],
    queryFn: () =>
      fetch("http://localhost:4000/restaurants")
        .then((res) => res.json())
  })
  const { data: reviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      fetch("http://localhost:4000/reviews")
        .then((res) => res.json())
  })
  const [category, setCategory] = useState("전체");
  const [visibleCount, setVisibleCount] = useState(6);
  const [search, setSearch] = useState("");

  {/**[category]가 감시 대상 category가 변경될 때 마다 더보기 초기화 시켜주기 위해 사용*/ }
  useEffect(() => {
    setVisibleCount(6);
  }, [category])

  {/**에러 로딩 데이터비었을때 */ }
  if (isLoading) {
    return <p>식당 정보를 불러오는중...</p>
  }

  if (isError) {
    return <p>식당 정보를 불러오지 못했습니다.</p>;
  }

  if (data?.length === 0) {
    return <p>등록된 식당이 없습니다.</p>
  }

  {/**식당 데이터에 자동으로 rating/reviewCount 붙이기 */ }
  {/**restaurantsWithReview : 식당 전체 목록을 하나씩 돌면서 리뷰 정보를 붙인 새로운 식당 배열을 만들어라.
    restaurantReviews : 현재 식당에 해당하는 리뷰들만 모아놓은 배열*/ }
  const restaurantsWithReview = data?.map((restaurant) => {
    const restaurantReviews =
      reviews?.filter(
        (review) => review.restaurantId === restaurant.id
      ) || [];

    {/**모인 리뷰 배열의 개수를 세는 것.*/ }
    const reviewCount = restaurantReviews.length;

    {/**restaurant.rating 별점 평균내는코드 */ }
    const rating =
      reviewCount > 0
        ? restaurantReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / reviewCount
        : null;
      {/** 가장 최근 리뷰 (없으면 null) */}
      const latestReview = 
      reviewCount > 0
       ? restaurantReviews[restaurantReviews.length -1]
        : null;

    return {
      ...restaurant,
      rating,
      reviewCount,
      latestReview,
    };
  });

  {/**카테고리가 전체일때 데이터그대로두고 아닐시 데이터를필터링해서 그에 맞는 카테고리 */ }
  const filteredRestaurant =
    category === "전체"
      ? restaurantsWithReview : restaurantsWithReview?.filter((restaurant) => restaurant.category === category);

  {/**현재 카테고리에서 한 번 걸러진 식당들 중에서, 사용자가 검색한 내용에 맞는 식당만 다시 걸러낸 결과*/ }
  const searchedRestaurants = filteredRestaurant.filter((restaurant) =>
    restaurant.name.includes(search) || restaurant.representativeMenu.includes(search)
  )

  {/**보여지는 개수에 따라 자름 */ }
  const visbleRestaurants = searchedRestaurants.slice(0, visibleCount)

  console.log("search:", search);
  console.log("검색 결과:", searchedRestaurants.length);

  {/** 카테고리버튼 배열만들기 */ }
  const categories = ["전체", "한식", "중식", "일식", "양식"];



  return (
    <main>
      <section className="hero">
        <div className="hero-text">
          <h1>
            오늘도 맛있는 점심,
            <br />
            함께 공유해요!
          </h1>
          <p>
            우리 동네 점심 맛집, 직접 먹어보고 리뷰를 남겨주세요.
            <br />
            다른 사람들의 맛있는 점심 선택에 도움이 됩니다.
          </p>
        </div>

        <div className="hero-image">
           <img src="/images/main/hero.png" alt="점심 일러스트" />

        </div>
      </section>



      <div className="review-form">
        <ReviewForm />
      </div>

      <div className="search-box">
        <span className="search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="식당 이름이나 메뉴를 검색하세요"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {search && searchedRestaurants.length === 0 && (
        <p> 검색 결과가 없습니다 </p>
      )}

      <div className="category-buttons">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>


      <div className="restaurant-grid">

        {visbleRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant} />
        ))}

        {/** 아직 안 보여준 식당이 있으면 더보기 버튼을 보여주고, 누르면 현재 카테고리의 식당을 전부 보여줘라."*/}
        {visibleCount < searchedRestaurants.length && (
          <button onClick={() => setVisibleCount(searchedRestaurants.length)}>
            더보기
          </button>
        )}
      </div>

    </main>
  )
}