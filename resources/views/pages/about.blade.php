@extends('layouts.app')

@section('title', 'О платформе')

@section('content')
    <div class="bg-white">
        <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-900 mb-8">О платформе Avtomatiz</h1>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Современная платформа для автоматизации бизнес-процессов и управления данными. 
                    Мы предоставляем инструменты для эффективного ведения бизнеса в цифровой эпохе.
                </p>
            </div>
            
            <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="text-center">
                    <div class="bg-indigo-100 rounded-lg p-6 mb-4">
                        <svg class="w-12 h-12 text-indigo-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Надежность</h3>
                    <p class="text-gray-600">Стабильная работа и безопасность ваших данных</p>
                </div>
                
                <div class="text-center">
                    <div class="bg-indigo-100 rounded-lg p-6 mb-4">
                        <svg class="w-12 h-12 text-indigo-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Производительность</h3>
                    <p class="text-gray-600">Быстрая обработка данных и современная архитектура</p>
                </div>
                
                <div class="text-center">
                    <div class="bg-indigo-100 rounded-lg p-6 mb-4">
                        <svg class="w-12 h-12 text-indigo-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Инновации</h3>
                    <p class="text-gray-600">Современные технологии для решения бизнес-задач</p>
                </div>
            </div>
        </div>
    </div>
@endsection 