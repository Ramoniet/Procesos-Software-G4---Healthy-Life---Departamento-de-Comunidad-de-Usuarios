import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../app/AppContext.tsx';
import { CommunityNotFound } from '../components/CommunityNotFound.tsx';
import { CommunityHeader } from '../components/CommunityHeader.tsx';
import { JoinRequestsList } from '../components/JoinRequestsList.tsx';
import {
  CommunityNavigationTabs,
  type CommunityTab,
} from '../components/CommunityNavigationTabs.tsx';
import { ShareAchievementCard } from '../components/ShareAchievementCard.tsx';
import { PostList } from '../components/PostList.tsx';
import { CreatePostForm } from '../components/CreatePostForm.tsx';
import { CommunityMemberList } from '../components/CommunityMemberList.tsx';
import { CommunityChallenges } from '../components/CommunityChallenges.tsx';
import { PendingFriendRequests } from '../components/PendingFriendRequests.tsx';
import { LeaveCommunityModal } from '../components/LeaveCommunityModal.tsx';

export function CommunityPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Pestaña activa: publicaciones, miembros o retos (disponible para todos los usuarios)
  const [activeTab, setActiveTab] = useState<CommunityTab>('posts');

  const {
    communities,
    currentUser,
    users,
    joinRequests,
    requestJoin,
    leaveCommunity,
    deleteCommunity,
    posts,
    challenges,
    createPost,
    comments,
    createComment,
    acceptJoinRequest,
    rejectJoinRequest,
  } = useApp();

  // Modales
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const community = communities.find((c) => c.id === id);

  if (!community) {
    return <CommunityNotFound />;
  }

  const isAdmin = community.adminId === currentUser.id;
  const isMember = community.memberIds.includes(currentUser.id);
  const adminUser = users.find((u) => u.id === community.adminId);

  const communityPosts = posts.filter((post) => post.communityId === id);
  const communityChallengeCount = challenges.filter(
    (challenge) => challenge.communityId === id,
  ).length;

  const communityJoinRequests = joinRequests.filter((r) => r.communityId === community.id);
  const hasJoinRequest = communityJoinRequests.some((r) => r.userId === currentUser.id);

  const handleJoin = () => {
    if (isMember || hasJoinRequest) return;
    requestJoin(community.id);
  };

  const handleConfirmLeave = () => {
    leaveCommunity(community.id);
    setShowLeaveModal(false);
  };

  const handleDelete = () => {
    deleteCommunity(community.id);
    navigate('/');
  };

  const handleCreatePost = (title: string, content: string) => {
    createPost(community.id, title, content);
    setShowCreatePostModal(false);
  };

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* ── Breadcrumb ── */}
      <button
        onClick={() => navigate('/')}
        className="self-start flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Todas las comunidades
      </button>

      {/* ── Header de la comunidad ── */}
      <CommunityHeader
        community={community}
        isAdmin={isAdmin}
        isMember={isMember}
        adminUser={adminUser}
        hasJoinRequest={hasJoinRequest}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onJoin={handleJoin}
        onOpenLeaveModal={() => setShowLeaveModal(true)}
        onDelete={handleDelete}
      />

      {/* ── Solicitudes de unión pendientes (solo para el admin) ── */}
      {isAdmin && (
        <JoinRequestsList
          requests={communityJoinRequests}
          users={users}
          communityId={community.id}
          onAccept={acceptJoinRequest}
          onReject={rejectJoinRequest}
        />
      )}

      {/* HU-20 — Solicitudes de amistad pendientes del usuario actual */}
      <PendingFriendRequests />

      {/* ── Pestañas de navegación de la comunidad ── */}
      <CommunityNavigationTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        postsCount={communityPosts.length}
        membersCount={community.memberIds.length}
        challengesCount={communityChallengeCount}
      />

      {/* ── Contenido según pestaña activa ── */}
      {activeTab === 'posts' ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-secondary">Publicaciones</h2>

          {isMember && (
            <ShareAchievementCard
              userName={currentUser.name}
              onClick={() => setShowCreatePostModal(true)}
            />
          )}

          <PostList
            posts={communityPosts}
            users={users}
            comments={comments}
            canComment={isMember}
            onCreateComment={createComment}
          />
        </div>
      ) : activeTab === 'members' ? (
        <CommunityMemberList community={community} users={users} />
      ) : (
        <CommunityChallenges communityId={community.id} />
      )}

      {/* ── Modal para publicar logro ── */}
      {showCreatePostModal && (
        <CreatePostForm
          onSubmit={handleCreatePost}
          onClose={() => setShowCreatePostModal(false)}
        />
      )}

      {/* ── Modal para abandonar comunidad ── */}
      {showLeaveModal && (
        <LeaveCommunityModal
          communityName={community.name}
          onConfirm={handleConfirmLeave}
          onCancel={() => setShowLeaveModal(false)}
        />
      )}
    </main>
  );
}
