"use client";
import React, { useEffect, useState } from 'react';
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import UserTable from '../components/UserTable';
import { getTeamMembersForUser } from '../api/admin';

const TeamMemberUsers = ({ userId, teamMemberId }) => {
  const id = userId || teamMemberId;
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    getTeamMembersForUser(id)
      .then(setTeamMembers)
      .catch(err => setError(err.message || 'Failed to fetch team members'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Box p={8}>
      <Heading size="lg" mb={4}>أعضاء فريق هذا المستخدم</Heading>
      {loading ? <Spinner /> : error ? <Text color="red.500">{error}</Text> : teamMembers.length === 0 ? (
        <Text color="gray.500">لا يوجد أعضاء فريق لهذا المستخدم.</Text>
      ) : (
        <UserTable users={teamMembers} onUpdateBalance={() => {}} />
      )}
    </Box>
  );
};

export default TeamMemberUsers; 