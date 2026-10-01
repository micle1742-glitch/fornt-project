"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function ReviewForm() {
    const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
    const [restaurantSearch, setRestaurantSearch] = useState("");
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const API_URL = "http://localhost:4000";
    const [menu, setMenu] = useState("");
    const [price, setPrice] = useState("");
    const queryClient = useQueryClient();
    const [showReviews, setShowReviews] = useState(false);
    const [hoverRating, setHoverRating] = useState(0) // 마우스가 올라간 별 점수 (0이면 안 올라간 상태)




    {/**서버에 식당 데이터를 요청한다 → 서버 응답을 받는다 → 그 응답을 JSON 데이터로 변환한다. 
    data를 retaurants값으로변환한다 */}
    const { data: restaurants, isLoading, isError } = useQuery({
        queryKey: ["restaurants"],
        queryFn: () =>
            fetch(`${API_URL}/restaurants`)
                .then((res) => res.json()),
    });

    {/**작성한 리뷰에대한 get요청을 review에서가져오는거 */ }
    const { data: reviews } = useQuery({
        queryKey: ["reviews"],
        queryFn: () =>
            fetch(`${API_URL}/reviews`)
                .then((res) => res.json())
    })
    if (isLoading) {
        return <div>식당 정보를 불러오는중...</div>
    }
    if (isError) {
        return <div>식당 정보를 가져오는데 실패했습니다...</div>
    }

    {/**리뷰 데이터를 JSON형식으로 변환 서버에 POST요청 */ }
    const handleSubmit = async () => {
        {/**선택안할시 alert로 넘어가는거막기 */ }
        if (!selectedRestaurantId) {
            alert("식당을 선택해주세요.");
            return;
        }
        if (!menu) {
            alert("메뉴를 입력해주세요.");
            return;
        }
        if (rating === 0) {
            alert("별점을 선택해주세요.");
            return;
        }
        {/**형식을 입력 */ }
        const newPost = {
            restaurantId: selectedRestaurantId,
            rating,
            content,
            menu,
            price: price === "" ? null : Number(price)
        }

        const response = await fetch(`${API_URL}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPost)
        })

        if (!response.ok) {
            throw new Error("리뷰 등록에 실패했습니다")
        }
        queryClient.invalidateQueries({
            queryKey: ["reviews"]
        });
        setShowReviews(true);

        {/**폼 초기화 검색창도*/ }
        setRestaurantSearch("")
        setRating(0)
        setContent("")
        setMenu("")
        setPrice("")
    }
    {/**폼안에 검색결과 이름이 DB와같은지고르는과정 */ }
    const filteredRestaurants = restaurants.filter((restaurant) => {
        return restaurant.name.includes(restaurantSearch);
    });

    {/**선택한 식당 자체를 가져오는 것 */ }
    const selectedRestaurant = restaurants.find((restaurant) => {
        return restaurant.id === selectedRestaurantId;
    });
    {/** 선택한 식당의 리뷰만 가져오기*/ }
    const selectedRestaurantReviews = reviews?.filter((review) => {
        return review.restaurantId === selectedRestaurantId;
    }) || [];

    {/** 리뷰 삭제 함수 */ }
    const handleDeleteReview = async (reviewId) => {
        const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
            method: "DELETE",
        })

        if (!response.ok) {
            throw new Error("리뷰 삭제에 실패했습니다.")
        }
        {/** 삭제데이터 React Query에게알려주기 */ }
        queryClient.invalidateQueries({
            queryKey: ["reviews"]
        });

    };


    return (
        <div>
            <h2 className="form-title">
                <img src="/images/common/logo.png" alt="" />
                점심 리뷰 작성하기
            </h2>

            {/**식당 선택 */}
            {!showReviews && (

                <div className="form-grid">
                    <div className="restaurant-field">
                        <label>식당 선택<span className="required">*</span></label>
                        <input
                            value={restaurantSearch}
                            onChange={(e) => {
                                setRestaurantSearch(e.target.value)
                                setSelectedRestaurantId("")
                            }}
                            placeholder="예) 순대실록"
                        />

                        {/** 입력한 검색어가 있고 아직 식당을 고르지 않았을 때만 드롭다운 표시 */}
                        {!selectedRestaurantId && restaurantSearch && (
                            <div className="restaurant-results">
                                {filteredRestaurants.map((restaurant) => (
                                    <button
                                        key={restaurant.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedRestaurantId(restaurant.id)
                                            setRestaurantSearch(restaurant.name)
                                        }}
                                    >
                                        {restaurant.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/**식당 메뉴 */}
                    <div>
                        <label>메뉴<span className="required">*</span></label>
                        <input
                            value={menu}
                            onChange={(e) => setMenu(e.target.value)}
                            placeholder="예) 제육볶음"
                        />
                    </div>

                    {/**식당 가격 */}
                    <div className="price-field">
                        <label>가격 (선택)</label>
                        <input
                            value={price}
                            type="number"
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="예) 10000"
                        />
                    </div>

                    {/**식당 리뷰 */}
                    <div className="review-field">
                        <label>한 줄 리뷰</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="리뷰를 작성해주세요">
                        </textarea>
                    </div>

                    {/**식당 별점 ⭐*/}
                    <div className="rating-row">
                        <label>별점</label>
                        <div className="star-rating"
                             onMouseLeave={() => setHoverRating(0)}
                             >
                            {[1, 2, 3, 4, 5].map((score) => (
                                <button
                                    key={score}
                                    type="button"
                                    className={score <= (hoverRating || rating) ? "star active" : "star"}
                                    onClick={() => setRating(score)}
                                    onMouseEnter={() => setHoverRating(score)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="button"
                        className="submit-button"
                        onClick={handleSubmit}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                        </svg>
                        리뷰 등록하기
                    </button>
                </div>
            )}

            {showReviews && (
                <div>
                    <h3>작성한 리뷰</h3>
                    <div className="review-list">
                        {selectedRestaurantReviews.map((review) => (
                            <div className="review-item" key={review.id}>
                                <p>⭐ {review.rating}</p>
                                <p>{review.content}</p>
                                <p>메뉴: {review.menu}</p>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteReview(review.id)}
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}