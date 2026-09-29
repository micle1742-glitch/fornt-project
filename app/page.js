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

  {/** 식당 데이터에 자동으로 rating/reviewCount 붙이기(이해가안됨)*/ }
  const restaurantsWithReview = data?.map((restaurant) => {
    const restaurantReviews =
      reviews?.filter(
        (review) => review.restaurantId === restaurant.id
      ) || [];

    const reviewCount = restaurantReviews.length;

    const rating =
      reviewCount > 0
        ? restaurantReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / reviewCount
        : null;

    return {
      ...restaurant,
      rating,
      reviewCount,
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



  return (
    <main>
      <h1>식권대장 뭐먹지</h1>

      <div>
        <input
          type="text"
          placeholder="식당 이름이나 메뉴를 검색하세요"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="review-form">
        <h2>점심 리뷰 작성하기</h2>
        <ReviewForm />


      </div>

      <div className="category-buttons">
        <button onClick={() => setCategory("전체")}>전체</button>
        <button onClick={() => setCategory("한식")}>한식</button>
        <button onClick={() => setCategory("중식")}>중식</button>
        <button onClick={() => setCategory("일식")}>일식</button>
        <button onClick={() => setCategory("양식")}>양식</button>
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