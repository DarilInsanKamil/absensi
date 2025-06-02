import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useKelas(id?: number) {
  const { data, error, mutate } = useSWR(
    id ? `/absensiteknomedia/api/kelas/${id}` : '/absensiteknomedia/api/kelas',
    fetcher
  );

  return {
    kelas: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}

export function useGuru() {
  const { data, error } = useSWR('/absensiteknomedia/api/guru', fetcher);

  return {
    guru: data,
    isLoading: !error && !data,
    isError: error
  };
}

export function useTahunAjaran() {
  const { data, error } = useSWR('/absensiteknomedia/api/tahunajaran', fetcher);

  return {
    tahunAjaran: data,
    isLoading: !error && !data,
    isError: error
  };
}