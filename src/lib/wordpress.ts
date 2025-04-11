import axios from 'axios';
import { Term } from './api';

// WordPress API endpoints
const WP_API_URL = 'https://saonamtg.com/wp-json';
const wpApiV2 = axios.create({ baseURL: `${WP_API_URL}/wp/v2` });

/**
 * Fetch tags from WordPress
 * @returns Array of tag terms
 */
export async function getTags(): Promise<ReadonlyArray<Term>> {
  try {
    const response = await wpApiV2.get('/tags?per_page=100&hide_empty=true');
    return response.data ?? [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}
