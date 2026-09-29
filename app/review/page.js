"use client"

import ReviewForm from "../ReviewForm";
import { useQuery } from "@tanstack/react-query";

export default function ReviewPage() {
    const API_URL = "http://localhost:4000";

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



    {/**폼에입력된 리뷰 가져오기 */ }
    return (
        <div>
            {reviews && reviews.map((review) => {
                {/** 리뷰의 restaurantId와 일치하는 식당 찾기 */}
                const restaurant = restaurants?.find(
                    (restaurant) => restaurant.id === review.restaurantId
                );
                return (
                    <div key={review.id}>
                        <h2>{restaurant?.name}</h2>
                        <p>{restaurant?.category}</p>
                        <p>⭐ {review.rating}</p>
                        <p>메뉴: {review.menu}</p>
                        <p>가격: {review.price ? `${review.price}원` : "가격 미입력"}</p>
                        <p>{review.content || "리뷰 내용 없음"}</p>
                    </div>
                )
            })}

        </div>
    )
}
