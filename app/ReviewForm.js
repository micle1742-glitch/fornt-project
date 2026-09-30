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
            {/**식당 선택 */}
            {!showReviews && (

                <div>
                    <label>식당 선택</label>
                    <input
                        value={restaurantSearch}
                        onChange={(e) => {
                            setRestaurantSearch(e.target.value)
                            setSelectedRestaurantId("")
                        }}
                        placeholder="식당을 검색하세요"
                    />

                    {/** filteredRestaurants의 식당을 하나씩 꺼내 restaurant라는 이름으로 사용하고 
                각 식당마다 div를 하나씩 만들어라*/}
                    {!selectedRestaurantId && restaurantSearch && filteredRestaurants.map((restaurant) => (

                        <div key={restaurant.id}>
                            {/**식당이름화면에보여줌 식당id데이터연결용으로저장 */}
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedRestaurantId(restaurant.id)
                                    setRestaurantSearch(restaurant.name)
                                }}
                            >
                                {restaurant.name}
                            </button>
                        </div>

                    ))}

                    {/**식당 메뉴 */}
                    <div>
                        <label>메뉴</label>
                        <input
                            value={menu}
                            onChange={(e) => setMenu(e.target.value)}
                            placeholder="먹은 메뉴를 입력하세요"
                        />
                    </div>

                    {/**식당 가격 */}
                    <div>
                        <label>가격 (선택)</label>
                        <input
                            value={price}
                            type="number"
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="가격을 입력해주세요"
                        />
                    </div>

                    {/**식당 별점 */}
                    <div>
                        <label>별점</label>
                        <div>
                            {[1, 2, 3, 4, 5].map((score) =>
                                <button
                                    key={score}
                                    type="button"
                                    onClick={() => setRating(score)}
                                >
                                    ⭐
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <label>리뷰 내용</label>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="리뷰를 작성해주세요">
                        </textarea>

                    </div>

                    <button type="button"
                        onClick={handleSubmit}>
                        리뷰 등록
                    </button>
                </div>
            )}
            {showReviews && (
                <div>
                    <h3>작성한 리뷰</h3>

                    {selectedRestaurantReviews.map((review) => (
                        <div key={review.id}>
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
            )}
        </div>
    );
}