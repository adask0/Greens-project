<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\MessageController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/register-company', [AuthController::class, 'registerCompany']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/reset-password/{token}', [AuthController::class, 'showResetForm']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::get('/users/{userId}/ratings', [RatingController::class, 'index']);
Route::get('/subscriptions', [SubscriptionController::class, 'index']);
Route::get('/subscriptions/{id}', [SubscriptionController::class, 'show']);
Route::put('/subscriptions/{id}', [SubscriptionController::class, 'update']);
Route::post('/subscriptions', [SubscriptionController::class, 'store']);
Route::delete('/subscriptions/{id}', [SubscriptionController::class, 'destroy']);
Route::get('/companies', [CompanyController::class, 'index']);
Route::get('/companies/all', [CompanyController::class, 'all']);
Route::get('/companies/{id}', [CompanyController::class, 'show']);
Route::post('/companies', [CompanyController::class, 'store']);
Route::put('/companies/{id}', [CompanyController::class, 'update']);
Route::put('/companies/bulk-update', [CompanyController::class, 'bulkUpdate']);
Route::delete('/companies/{id}', [CompanyController::class, 'destroy']);
Route::patch('/companies/{id}/status', [CompanyController::class, 'changeStatus']);
Route::put('/subscriptions/bulk-update', [SubscriptionController::class, 'bulkUpdate']);
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{id}', [ListingController::class, 'show']);
Route::get('/user/favorites', [UserController::class, 'getFavorites']);
Route::post('/listings/{id}/toggle-favorite', [ListingController::class, 'toggleFavorite']);
Route::get('/listings/statistics', [ListingController::class, 'statistics']);
Route::get('/reviews', [ReviewController::class, 'index']);
Route::get('/reviews/statistics', [ReviewController::class, 'statistics']);

Route::get('/listings/{id}/comments', [MessageController::class, 'getApprovedComments']);
Route::post('/listings/{id}/increment-clicks', [ListingController::class, 'incrementClicks']);
Route::get('/messages/statistics', [MessageController::class, 'statistics']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [UserController::class, 'contractorProfile']);
    Route::put('/profile', [UserController::class, 'updateContractorProfile']);
    Route::put('/change-password', [UserController::class, 'changePassword']);
    Route::post('/ratings', [RatingController::class, 'store']);
    Route::post('/profile/avatar', [UserController::class, 'uploadAvatar']);
    Route::post('/comments', [MessageController::class, 'storeComment']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::post('/listings/{id}/toggle-favorite', [ListingController::class, 'toggleFavorite']);
    Route::get('/user/favorites', [UserController::class, 'getFavorites']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/contractor/profile', [UserController::class, 'contractorProfile']);
    Route::put('/contractor/profile', [UserController::class, 'updateContractorProfile']);
    Route::post('/contractor/profile/avatar', [UserController::class, 'uploadAvatar']); // DODANA TRASA

    Route::get('/contractor/listings', [ListingController::class, 'contractorIndex']);
    Route::post('/contractor/listings', [ListingController::class, 'contractorStore']);
    Route::put('/contractor/listings/{id}', [ListingController::class, 'contractorUpdate']);
    Route::delete('/contractor/listings/{id}', [ListingController::class, 'contractorDestroy']);
    Route::patch('/contractor/listings/{id}/status', [ListingController::class, 'contractorToggleStatus']);
    Route::patch('/contractor/listings/{id}/toggle-featured', [ListingController::class, 'contractorToggleFeatured']);
    Route::post('/contractor/listings/{listing}/images', [ListingController::class, 'uploadImages']);
    Route::delete('/contractor/listings/{listing}/images/{image}', [ListingController::class, 'deleteImage']);
    Route::get('/contractor/listings/{listing}/images', [ListingController::class, 'getImages']);

    Route::get('/contractor/subscription', [SubscriptionController::class, 'contractorCurrent']);
    Route::post('/contractor/subscription', [SubscriptionController::class, 'contractorSubscribe']);
    Route::put('/contractor/subscription', [SubscriptionController::class, 'contractorUpdate']);

    Route::get('/contractor/messages', [MessageController::class, 'contractorMessages']);
    Route::post('/contractor/messages/{id}/reply', [MessageController::class, 'contractorReply']);
    Route::patch('/contractor/messages/{id}/read', [MessageController::class, 'contractorMarkRead']);

    Route::get('/contractor/reviews', [ReviewController::class, 'contractorIndex']);
    Route::post('/contractor/reviews/{id}/reply', [ReviewController::class, 'contractorReply']);
    Route::put('/contractor/reviews/{id}/reply', [ReviewController::class, 'contractorUpdateReply']);

    Route::get('/contractor/settings/notifications', [UserController::class, 'getNotificationSettings']);
    Route::put('/contractor/settings/notifications', [UserController::class, 'updateNotificationSettings']);
    Route::get('/contractor/settings/privacy', [UserController::class, 'getPrivacySettings']);
    Route::put('/contractor/settings/privacy', [UserController::class, 'updatePrivacySettings']);

    Route::get('/contractor/statistics', [ListingController::class, 'contractorStatistics']);
    Route::get('/contractor/reviews', [MessageController::class, 'contractorReviews']);
    Route::get('/contractor/reviews/statistics', [MessageController::class, 'contractorReviewsStatistics']);
    Route::post('/contractor/reviews/{id}/reply', [MessageController::class, 'contractorReviewReply']);
    Route::patch('/contractor/reviews/{id}/visibility', [MessageController::class, 'contractorReviewVisibility']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/contractor/profile', [UserController::class, 'contractorProfile']);
    Route::put('/contractor/profile', [UserController::class, 'updateContractorProfile']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/listings', [ListingController::class, 'adminIndex']);
    Route::post('/admin/listings', [ListingController::class, 'store']);
    Route::put('/admin/listings/{id}', [ListingController::class, 'update']);
    Route::delete('/admin/listings/{id}', [ListingController::class, 'destroy']);
    Route::patch('/admin/listings/{id}/status', [ListingController::class, 'changeStatus']);
    Route::patch('/admin/listings/{id}/toggle-featured', [ListingController::class, 'toggleFeatured']);

    Route::get('/admin/reviews', [ReviewController::class, 'adminIndex']);
    Route::post('/admin/reviews', [ReviewController::class, 'store']);
    Route::put('/admin/reviews/{id}', [ReviewController::class, 'update']);
    Route::patch('/admin/reviews/{id}/toggle-visibility', [ReviewController::class, 'toggleVisibility']);
    Route::put('/admin/reviews/bulk-update', [ReviewController::class, 'bulkUpdate']);
    Route::delete('/admin/reviews/{id}', [ReviewController::class, 'destroy']);

    Route::get('/admin/messages', [MessageController::class, 'adminIndex']);
    Route::get('/admin/messages/{id}', [MessageController::class, 'show']);
    Route::post('/admin/messages/{id}/reply', [MessageController::class, 'adminReply']);
    Route::patch('/admin/messages/{id}/status', [MessageController::class, 'updateStatus']);
    Route::post('/admin/messages/{id}/notify-approval', [MessageController::class, 'notifyApproval']);
    Route::put('/admin/messages/bulk-update', [MessageController::class, 'bulkUpdate']);
    Route::delete('/admin/messages/{id}', [MessageController::class, 'destroy']);
});
