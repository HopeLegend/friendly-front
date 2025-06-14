import { api } from "./axios";
import { usersAPI } from "./users";

export const newsAPI = {
  /**
   * Получает новости текущего пользователя
   */
  getMyNews: async () => {
    try {
      const response = await api.get(`/news/feed/list`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
          throw error;
      }
  },

  /**
   * Получает новости пользователя по ID
   */
  getUserNews: async (userId) => {
    if (!userId) {
      console.warn('getUserNews: userId не указан');
      return [];
    }

    try {
      const response = await api.get(`/news/feed/list?usr_id=${userId}`);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error(`Неверный формат данных для пользователя ${userId}`);
      }

      // Сортировка по дате
      const sortedNews = [...response.data].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });

      // Загрузка полных данных
      const fullNewsPromises = sortedNews.map(async (news) => {
        if (!news || !news.news_id) {
          console.warn('getUserNews: Неверный формат новости:', news);
          return null;
        }
        
        return newsAPI.getFullNewsData(news.news_id);
      });

      const results = await Promise.all(fullNewsPromises);
      return results.filter(news => news !== null);

    } catch (error) {
          throw error;
      }
  },

  /**
   * Получает полные данные новости по ID
   */
  getFullNewsData: async (news_id) => {
    if (!news_id) {
      console.warn('getFullNewsData: news_id не указан');
      return null;
    }

    try {
      const response = await api.get(`/news/feed/${news_id}`);
      return response.data || null;
    } catch (error) {
          throw error;
      }
  },

  /**
   * Получает новости друзей
   */
  getNews: async () => {
    try {
      const friends = await usersAPI.getMyFriends();
      
      if (!friends || !Array.isArray(friends)) {
        throw new Error('Неверный формат данных друзей');
      }

      // Фильтрация и подготовка промисов
      const validFriends = friends.filter(friend => 
        friend && friend.friend_id
      );

      const newsPromises = validFriends.map(async (friend) => {
        const userId = friend.friend_id;
        return newsAPI.getUserNews(userId);
      });

      // Загрузка всех новостей
      const newsArrays = await Promise.all(newsPromises);
      const allNews = newsArrays
        .flat()
        .filter(news => news); // Убираем null

      // Сортировка по дате
      const sortedAllNews = [...allNews].sort((a, b) => {
        const dateA = new Date(a.post_body.created_at);
        const dateB = new Date(b.post_body.created_at);
        return dateB - dateA;
      });

      // Возвращаем полные данные
      return sortedAllNews;

    } catch (error) {
          throw error;
      }
  },

  /**
   * Создаёт новую новость
   */
  createNews: async (data) => {
    try {
      const response = await api.post(`/news/produce_content`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Добавляет реакцию к новости
   */
  addReaction: async (news_id, reaction_type) => {
    if (!news_id || !reaction_type) {
      console.warn('addReaction: Отсутствуют параметры');
      return null;
    }

    try {
      const response = await api.post(`/news/add_reaction/${news_id}?reaction_type=${reaction_type}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteNews: async (news_id) => {
    try {
        const response = await api.delete(`/news/erase_post/${news_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }

  }
};