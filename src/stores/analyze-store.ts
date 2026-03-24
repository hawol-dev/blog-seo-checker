'use client';

import { create } from 'zustand';
import type { AnalyzeInput, AnalyzeResult } from '@/lib/seo/types';
import { analyzePost } from '@/actions/analyze';

interface AnalyzeState {
  // Form fields
  title: string;
  keyword: string;
  content: string;
  imageCount: number;
  videoCount: number;
  tagCount: number;
  externalLinkCount: number;
  internalLinkCount: number;

  // Result
  result: AnalyzeResult | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setField: <K extends keyof AnalyzeInput>(field: K, value: AnalyzeInput[K]) => void;
  analyze: () => Promise<void>;
  reset: () => void;
}

export const useAnalyzeStore = create<AnalyzeState>((set, get) => ({
  title: '',
  keyword: '',
  content: '',
  imageCount: 0,
  videoCount: 0,
  tagCount: 0,
  externalLinkCount: 0,
  internalLinkCount: 0,
  result: null,
  isLoading: false,
  error: null,

  setField: (field, value) => set({ [field]: value }),

  analyze: async () => {
    const state = get();
    set({ isLoading: true, error: null });
    try {
      const result = await analyzePost({
        title: state.title,
        keyword: state.keyword,
        content: state.content,
        imageCount: state.imageCount,
        videoCount: state.videoCount,
        tagCount: state.tagCount,
        externalLinkCount: state.externalLinkCount,
        internalLinkCount: state.internalLinkCount,
      });
      set({ result, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '분석 중 오류가 발생했어요.',
        isLoading: false,
      });
    }
  },

  reset: () =>
    set({
      title: '',
      keyword: '',
      content: '',
      imageCount: 0,
      videoCount: 0,
      tagCount: 0,
      externalLinkCount: 0,
      internalLinkCount: 0,
      result: null,
      error: null,
    }),
}));
