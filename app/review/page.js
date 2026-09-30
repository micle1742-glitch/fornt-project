"use client"

import "./review.css";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function ReviewPage() {
    const API_URL = "http://localhost:4000";
    const queryClient = useQueryClient();

    const { data: restaurants } = useQuery({
        queryKey: ["restaurants"],
        queryFn: () =>
            fetch(`${API_URL}/restaurants`)
                .then((res) => res.json()),
    });

    const { data: reviews } = useQuery({
        queryKey: ["reviews"],
        queryFn: () =>
            fetch(`${API_URL}/reviews`)
                .then((res) => res.json()),
    })

    {/**랜덤숫자뽑아서 배열의길이에따라 나오게함 */ }
    const [selectedRestaurant, setselectedRestaurant] = useState() //selectedRestaurant : 현재화면에 보여줄 식당
    const handleRandom = () => {
        if (!restaurants || restaurants.length === 0) {
            return
        }
        const randomIndex = Math.floor(
            Math.random() * restaurants.length
        );
        setselectedRestaurant(
            getRestaurantWithReview(restaurants[randomIndex])
        )
    }
    {/** representativeReview: 랜덤으로 봅힌 식당에 해당하는 리뷰를 하나 찾아 저장*/ }
    const representativeReview = reviews?.find(
        (review) => review.restaurantId === selectedRestaurant?.id
    )




    {/**1페이지의 식당카드 정보 가져오기 */ }
    const searchParams = useSearchParams();
    const restaurantId = searchParams.get("id") //id get하기
    useEffect(() => {
        const restaurant = restaurants?.find(
            ((restaurant) => restaurant.id === restaurantId) //restaurant: URL에서 가져온 배열에서 해당 식당 찾기
        );
        if (restaurant) {
            setselectedRestaurant(
                getRestaurantWithReview(restaurant)
            )
        }
    }, [restaurantId, restaurants])


    {/**raiting reviewcount합쳐주기 */ }
    const getRestaurantWithReview = (restaurant) => {
        {/** 식당 리뷰만 가져오기 */ }
        const restaurantReviews = reviews?.filter(
            (review) => review.restaurantId === restaurant.id
        ) || [];

        {/**리뷰 갯수 구하기 / 평균 별점 + 리뷰 개수 표시하도록 구조 잡음*/ }
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
            reviewCount
        };
    }





    {/**폼에입력된 리뷰 가져오기 */ }
    return (
        <div className="review-page">

            <div>
                <button
                    className="random-button"
                    onClick={handleRandom}
                >
                    오늘의 점심 추천 {selectedRestaurant?.name}
                </button>
            </div>

            {selectedRestaurant && (
                <div className="restaurant-detail">
                    <div className="restaurant-detail-image"></div>

                    <div className="restaurant-detail-info">
                        <h2>{selectedRestaurant?.name}</h2>
                        <p>{selectedRestaurant?.category}</p>
                        <p>{selectedRestaurant?.distance}</p>
                        <p>{selectedRestaurant?.representativeMenu}</p>
                        <p>{selectedRestaurant?.price}</p>

                        {representativeReview && (
                            <div className="representative-review">
                                <h3>대표 리뷰</h3>

                                <p className="representative-review-content">
                                    {representativeReview?.content}</p>
                                <p>
                                    {selectedRestaurant.rating !== null
                                        ? `⭐${selectedRestaurant.rating} (${selectedRestaurant.reviewCount}개 리뷰)`
                                        : "리뷰 없음"}
                                </p>

                            </div>
                        )}

                        {!representativeReview && (
                            <div>
                                <p>리뷰 없음</p>
                            </div>
                        )}
                        <div className="detail-actions">
                            <button>지도에서 보기</button>
                            <button>찜하기</button>
                        </div>
                    </div>

                </div>
            )}

        </div>
    )
}