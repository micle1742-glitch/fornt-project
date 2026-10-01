"use client"

import "./review.css";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

{/** 빈 화면 안내 카드 내용 */ }
{/** 빈 화면 안내 카드 내용 */ }
const features = [
    {
        title: "랜덤 추천",
        desc: "등록된 식당 중\n하나를 추천해드려요!",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#3f7046" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
            </svg>
        ),
    },
    {
        title: "다양한 맛집",
        desc: "한식, 중식, 일식, 양식 등\n다양한 식당이 있어요!",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#3f7046" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M9 8h6M9 12h6M9 16h4" />
            </svg>
        ),
    },
    {
        title: "리뷰 확인",
        desc: "다른 사람들의 리뷰도\n함께 볼 수 있어요!",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#e5483b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z" />
            </svg>
        ),
    },
];

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

            {(!selectedRestaurant) && (
                <div className="empty-state">
                    <div className="empty-image">
                        <img src="/images/review/empty.png" alt="비빔밥 일러스트" />
                    </div>
                    <h1>오늘 뭐 먹지...?</h1>
                    <p className="empty-desc">
                        아직 선택한 식당이 없어요!<br />
                        오늘의 점심을 랜덤으로 추천받아보세요.
                    </p>
                    <button className="random-button" onClick={handleRandom}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
                            <path d="m18 2 4 4-4 4" />
                            <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
                            <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
                            <path d="m18 14 4 4-4 4" />
                        </svg>
                        오늘의 점심 추천
                    </button>

                    <div className="feature-list">
                        {features.map((feature) => (
                            <div className="feature-item" key={feature.title}>
                                <h3>{feature.icon}{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedRestaurant && (
                <div className="review-hero">
                    <span className="spark spark-1" aria-hidden="true"></span>
                    <span className="spark spark-2" aria-hidden="true"></span>
                    <span className="spark spark-3" aria-hidden="true"></span>
                    <span className="spark spark-4" aria-hidden="true"></span>
                    <p className="review-hero-sub">오늘 뭐 먹지...?</p>
                    <h1>오늘의 점심은 여기 어때요?</h1>
                    <p className="review-hero-desc">
                        등록된 맛집 중 하나를 랜덤으로 추천해드려요!<br />
                        새로운 맛집을 발견해보세요.
                    </p>
                    <button
                        className="random-button"
                        onClick={handleRandom}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
                            <path d="m18 2 4 4-4 4" />
                            <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
                            <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
                            <path d="m18 14 4 4-4 4" />
                        </svg>
                        오늘의 점심 뽑기
                    </button>
                    <p className="review-hero-hint">버튼을 누르면 추천이 시작됩니다!</p>
                </div>
            )}

            {selectedRestaurant && (
                <div className="restaurant-detail">
                    <div className="detail-title">
                        오늘의 <span>점심 추천!</span>
                    </div>

                    <div className="restaurant-detail-image">
                        {selectedRestaurant?.image && (
                            <img src={selectedRestaurant.image} alt={selectedRestaurant.name} />
                        )}
                    </div>

                    <div className="restaurant-detail-info">
                        <span className="detail-badge">{selectedRestaurant?.category}</span>
                        <h2>{selectedRestaurant?.name}</h2>
                        <p>{selectedRestaurant?.representativeMenu} · {selectedRestaurant?.distance}m</p>
                        <p className="detail-price">{selectedRestaurant?.price}원</p>
                        <p className="detail-rating">
                            {selectedRestaurant.rating !== null
                                ? `⭐ ${selectedRestaurant.rating.toFixed(1)} (${selectedRestaurant.reviewCount}개 리뷰)`
                                : "☆ 0.0 (0개 리뷰)"}
                        </p>

                        {representativeReview && (
                            <div className="representative-review">
                                <h3>대표 리뷰</h3>
                                <p className="representative-review-content">
                                    {representativeReview?.content}</p>
                            </div>
                        )}

                        {!representativeReview && (
                            <div className="no-review">
                                <p>리뷰 없음</p>
                            </div>
                        )}
                        <div className="detail-actions">
                            <button className="map-button">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
                                    <circle cx="12" cy="9" r="2.5" />
                                </svg>
                                지도에서 보기
                            </button>
                            <button className="like-button">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z" />
                                </svg>
                                찜하기
                            </button>
                        </div>

                    </div>
                </div>
            )}
            {selectedRestaurant && (
                <div className="slogan-banner">
                    <span className="spark spark-5" aria-hidden="true"></span>
                    <p className="slogan-text">"맛있는 점심이 좋은 하루를 만든다!"</p>
                    <div className="slogan-image"></div>
                    <img className="slogan-image" src="/images/review/bowl.png" alt="비빔밥 그릇" />
                    <span className="spark spark-6" aria-hidden="true"></span>
                </div>
            )}

        </div>
    )
}