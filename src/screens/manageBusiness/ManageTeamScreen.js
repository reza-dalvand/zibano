// src/screens/manageBusiness/ManageTeamScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useBusiness } from '../../context/BusinessContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import TeamManagement from '../../components/createbusiness/TeamManagement';

export default function ManageTeamScreen({ navigation }) {
  const { businessData, addTeamMember, updateTeamMember, deleteTeamMember } =
    useBusiness();

  const handleChange = (updatedTeam) => {
    const currentTeam = businessData.team || [];

    // اضافه کردن اعضا جدید
    const newMembers = updatedTeam.filter(
      (m) => !currentTeam.find((cm) => cm.id === m.id)
    );
    newMembers.forEach((m) => addTeamMember(m));

    // حذف اعضا
    currentTeam.forEach((cm) => {
      if (!updatedTeam.find((m) => m.id === cm.id)) {
        deleteTeamMember(cm.id);
      }
    });

    // ویرایش اعضا
    updatedTeam.forEach((um) => {
      const current = currentTeam.find((cm) => cm.id === um.id);
      if (current && JSON.stringify(current) !== JSON.stringify(um)) {
        updateTeamMember(um.id, um);
      }
    });
  };

  return (
    <ScreenWrapper padding={0} edges={['top']}>
      <Header title="مدیریت تیم" onBackPress={() => navigation.goBack()} />
      <View style={s.content}>
        <TeamManagement
          team={businessData.team || []}
          services={businessData.services || []}
          onChange={handleChange}
        />
      </View>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
});