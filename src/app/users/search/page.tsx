'use client';
import dynamic from 'next/dynamic';
const HeaderSmart = dynamic(
  () => import('../../../components/organisms/HeaderSmart'),
  { ssr: false }
);
import SearchBar from '../../../components/molecules/SearchBar';
import MenuBar from '../../../components/molecules/MenuBar';

export default function SearchUsersPage() {
  return (
    <main className='min-h-screen bg-black'>
      <HeaderSmart />
      <div className='w-full max-w-[600px] mx-auto px-4 py-xl'>
        <SearchBar placeholder='Search users' />
      </div>
      <div className='fixed inset-x-0 bottom-10 flex justify-center'>
        <MenuBar />
      </div>
    </main>
  );
}
