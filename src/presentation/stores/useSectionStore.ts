/**
 * useSectionStore - Zustand store for managing sections within lists
 *
 * Implements optimistic updates with rollback on error.
 * Handles CRUD operations for sections and item-section associations.
 */

import { create, type StoreApi, type UseBoundStore } from 'zustand';

import type {
  CreateSectionInput,
  Section,
  UpdateSectionInput,
} from '@domain/section/entities/section.entity';
import type { SectionRepository } from '@domain/section/ports/section.repository';

/**
 * Dependencies required by the section store
 */
export interface SectionStoreDependencies {
  sectionRepository: SectionRepository;
}

/**
 * State shape for the section store
 */
export interface SectionStoreState {
  /** Sections grouped by list ID */
  sectionsByListId: Record<string, Section[]>;

  /** Whether a loading operation is in progress */
  isLoading: boolean;

  /** Current error message, if any */
  error: string | null;

  /** Expansion state for sections (keyed by section ID) */
  expandedSections: Record<string, boolean>;
}

/**
 * Actions available on the section store
 */
export interface SectionStoreActions {
  /**
   * Load sections for a specific list
   * @param listId - The list ID to load sections for
   */
  loadSections: (listId: string) => Promise<void>;

  /**
   * Create a new section with optimistic update
   * @param input - The section input
   * @returns The created section, or null on failure
   */
  createSection: (input: CreateSectionInput) => Promise<Section | null>;

  /**
   * Update an existing section with optimistic update
   * @param id - The section ID
   * @param updates - The updates to apply
   * @returns The updated section, or null on failure
   */
  updateSection: (id: string, updates: UpdateSectionInput) => Promise<Section | null>;

  /**
   * Delete a section with optimistic update
   * @param id - The section ID
   * @param listId - The list ID the section belongs to
   * @returns True if deleted successfully
   */
  deleteSection: (id: string, listId: string) => Promise<boolean>;

  /**
   * Update sort order for sections (after drag and drop)
   * @param listId - The list ID
   * @param sections - Sections in new order
   */
  updateSortOrder: (listId: string, sections: Section[]) => Promise<boolean>;

  /**
   * Toggle section expansion state
   * @param sectionId - The section ID to toggle
   */
  toggleSectionExpanded: (sectionId: string) => void;

  /**
   * Get sections for a specific list
   * @param listId - The list ID
   * @returns Sections for the list, sorted by sortOrder
   */
  getSectionsByListId: (listId: string) => Section[];

  /**
   * Clear sections for a specific list
   * @param listId - The list ID to clear sections for
   */
  clearSections: (listId: string) => void;

  /**
   * Clear all sections from the store
   */
  clearAllSections: () => void;

  /**
   * Clear any error state
   */
  clearError: () => void;
}

export type SectionStore = SectionStoreState & SectionStoreActions;

/**
 * Type for the created store instance
 */
export type SectionStoreInstance = UseBoundStore<StoreApi<SectionStore>>;

/**
 * Generate a temporary ID for optimistic updates
 */
function generateTempId(): string {
  return `temp-section-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Create an optimistic section from input
 */
function createOptimisticSection(input: CreateSectionInput, tempId: string): Section {
  const now = new Date();
  return {
    id: tempId,
    listId: input.listId,
    name: input.name,
    sortOrder: input.sortOrder,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Create the section store factory
 *
 * @param deps - Repository dependencies
 * @returns A configured Zustand store
 */
export function createSectionStore(deps: SectionStoreDependencies): SectionStoreInstance {
  const { sectionRepository } = deps;

  return create<SectionStore>((set, get) => ({
    // Initial state
    sectionsByListId: {},
    isLoading: false,
    error: null,
    expandedSections: {},

    // Load sections for a list
    loadSections: async (listId: string): Promise<void> => {
      set({ isLoading: true, error: null });

      try {
        const sections = await sectionRepository.getByListId(listId);

        // Sort by sortOrder
        const sortedSections = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);

        set({
          sectionsByListId: {
            ...get().sectionsByListId,
            [listId]: sortedSections,
          },
          isLoading: false,
        });

        // Initialize expansion state for new sections
        const currentExpanded = get().expandedSections;
        const newExpanded = { ...currentExpanded };
        for (const section of sortedSections) {
          if (newExpanded[section.id] === undefined) {
            newExpanded[section.id] = true; // Expanded by default
          }
        }
        set({ expandedSections: newExpanded });

        console.debug(`[useSectionStore] Loaded ${sortedSections.length} sections for list ${listId}`);
      } catch (error) {
        set({ isLoading: false, error: 'Failed to load sections' });
        console.error('[useSectionStore] Failed to load sections:', error);
      }
    },

    // Create section with optimistic update
    createSection: async (input: CreateSectionInput): Promise<Section | null> => {
      const tempId = generateTempId();
      const optimisticSection = createOptimisticSection(input, tempId);

      // Backup current state for rollback
      const backup = { ...get().sectionsByListId };
      const currentSections = backup[input.listId] ?? [];

      // Optimistic update - add section immediately
      set({
        sectionsByListId: {
          ...backup,
          [input.listId]: [...currentSections, optimisticSection],
        },
        error: null,
        expandedSections: {
          ...get().expandedSections,
          [tempId]: true,
        },
      });

      try {
        const created = await sectionRepository.create(input);

        // Replace optimistic section with real section
        const updatedSections = get().sectionsByListId[input.listId]?.map((section) =>
          section.id === tempId ? created : section,
        ) ?? [created];

        // Update expansion state with real ID
        const expandedSections = { ...get().expandedSections };
        delete expandedSections[tempId];
        expandedSections[created.id] = true;

        set({
          sectionsByListId: {
            ...get().sectionsByListId,
            [input.listId]: updatedSections,
          },
          expandedSections,
        });

        console.debug('[useSectionStore] Created section:', created.id);
        return created;
      } catch (error) {
        // Rollback on error
        set({ sectionsByListId: backup, error: 'Failed to create section' });
        console.error('[useSectionStore] Failed to create section:', error);
        return null;
      }
    },

    // Update section with optimistic update
    updateSection: async (id: string, updates: UpdateSectionInput): Promise<Section | null> => {
      const backup = { ...get().sectionsByListId };

      // Find the section and its list
      let listId: string | null = null;
      let existingSection: Section | null = null;

      for (const [lid, sections] of Object.entries(backup)) {
        const found = sections.find((s) => s.id === id);
        if (found) {
          listId = lid;
          existingSection = found;
          break;
        }
      }

      if (!listId || !existingSection) {
        return null;
      }

      // Optimistic update - apply changes immediately
      const optimisticSection = {
        ...existingSection,
        ...updates,
        updatedAt: new Date(),
      } as Section;

      set({
        sectionsByListId: {
          ...backup,
          [listId]: backup[listId].map((s) => (s.id === id ? optimisticSection : s)),
        },
        error: null,
      });

      try {
        const updated = await sectionRepository.update(id, updates);

        if (!updated) {
          // Section not found in DB - rollback
          set({ sectionsByListId: backup, error: 'Section not found' });
          return null;
        }

        // Replace with actual updated section
        set({
          sectionsByListId: {
            ...get().sectionsByListId,
            [listId]: get().sectionsByListId[listId].map((s) => (s.id === id ? updated : s)),
          },
        });

        console.debug('[useSectionStore] Updated section:', id);
        return updated;
      } catch (error) {
        // Rollback on error
        set({ sectionsByListId: backup, error: 'Failed to update section' });
        console.error('[useSectionStore] Failed to update section:', error);
        return null;
      }
    },

    // Delete section with optimistic update
    deleteSection: async (id: string, listId: string): Promise<boolean> => {
      const backup = { ...get().sectionsByListId };
      const expandedBackup = { ...get().expandedSections };

      // Optimistic update - remove section immediately
      const updatedExpanded = { ...expandedBackup };
      delete updatedExpanded[id];

      set({
        sectionsByListId: {
          ...backup,
          [listId]: (backup[listId] ?? []).filter((s) => s.id !== id),
        },
        expandedSections: updatedExpanded,
        error: null,
      });

      try {
        const success = await sectionRepository.delete(id);

        if (!success) {
          // Delete failed - rollback
          set({
            sectionsByListId: backup,
            expandedSections: expandedBackup,
            error: 'Failed to delete section',
          });
          return false;
        }

        console.debug('[useSectionStore] Deleted section:', id);
        return true;
      } catch (error) {
        // Rollback on error
        set({
          sectionsByListId: backup,
          expandedSections: expandedBackup,
          error: 'Failed to delete section',
        });
        console.error('[useSectionStore] Failed to delete section:', error);
        return false;
      }
    },

    // Update sort order for sections
    updateSortOrder: async (listId: string, sections: Section[]): Promise<boolean> => {
      const backup = { ...get().sectionsByListId };

      // Optimistic update - update order immediately
      const reorderedSections = sections.map((section, index) => ({
        ...section,
        sortOrder: index,
      }));

      set({
        sectionsByListId: {
          ...backup,
          [listId]: reorderedSections,
        },
        error: null,
      });

      try {
        // Update each section's sortOrder in the database
        const updatePromises = sections.map((section, index) =>
          sectionRepository.update(section.id, { sortOrder: index }),
        );

        await Promise.all(updatePromises);

        console.debug(`[useSectionStore] Updated sort order for ${sections.length} sections`);
        return true;
      } catch (error) {
        // Rollback on error
        set({ sectionsByListId: backup, error: 'Failed to update sort order' });
        console.error('[useSectionStore] Failed to update sort order:', error);
        return false;
      }
    },

    // Toggle section expansion
    toggleSectionExpanded: (sectionId: string): void => {
      set({
        expandedSections: {
          ...get().expandedSections,
          [sectionId]: !get().expandedSections[sectionId],
        },
      });
    },

    // Get sections for a list
    getSectionsByListId: (listId: string): Section[] => {
      return get().sectionsByListId[listId] ?? [];
    },

    // Clear sections for a specific list
    clearSections: (listId: string): void => {
      const current = { ...get().sectionsByListId };
      delete current[listId];
      set({ sectionsByListId: current });
    },

    // Clear all sections
    clearAllSections: (): void => {
      set({
        sectionsByListId: {},
        expandedSections: {},
      });
    },

    // Clear error state
    clearError: (): void => {
      set({ error: null });
    },
  }));
}
