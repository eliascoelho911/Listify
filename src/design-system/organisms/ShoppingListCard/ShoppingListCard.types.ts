/**
 * ShoppingListCard Organism Types
 */

export interface ShoppingListCardProps {
  /**
   * List title
   */
  title: string;

  /**
   * Number of items in the list
   */
  itemCount: number;

  /**
   * Number of completed items
   */
  completedCount: number;

  /**
   * List total value (optional)
   */
  totalValue?: string;

  /**
   * When the list was last updated
   */
  lastUpdated?: string;

  /**
   * List status badge
   */
  status?: 'active' | 'completed' | 'archived';

  /**
   * Callback when card is pressed
   */
  onPress?: () => void;
}
