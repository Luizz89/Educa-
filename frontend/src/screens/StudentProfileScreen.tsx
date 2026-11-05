import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, type TextInputInstance, useWindowDimensions, View } from 'react-native';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { StudentActivityPreview } from '../components/student/StudentActivityPreview';
import { StudentModal } from '../components/student/StudentModal';
import { StudentShell } from '../components/student/StudentShell';
import { StudentSummaryCard } from '../components/student/StudentSummaryCard';
import { getStudentHomeSummary } from '../data/studentHomeMock';
import { useStudentDemo } from '../state/StudentDemoContext';
import { colors, fonts, radius } from '../theme';
import { getStudentInitials, validateStudentProfile } from '../utils/studentProfile';

export function StudentProfileScreen() {
  const { data, updateProfile } = useStudentDemo();
  const { width, fontScale } = useWindowDimensions();
  const wide = width >= 840 && fontScale <= 1.3;
  const summary = getStudentHomeSummary(data);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState<{ displayName?: string; bio?: string }>({});
  const [saved, setSaved] = useState(false);
  const bioRef = useRef<TextInputInstance>(null);

  function openEditor() {
    setDisplayName(data.student.displayName);
    setBio(data.student.bio);
    setErrors({});
    setSaved(false);
    setEditing(true);
  }

  function saveProfile() {
    const next = validateStudentProfile(displayName, bio);
    setErrors(next);
    if (next.displayName || next.bio) return;
    updateProfile({ displayName: displayName.trim().replace(/\s+/g, ' '), bio: bio.trim() });
    setEditing(false);
    setSaved(true);
  }

  return (
    <StudentShell active="profile">
      {({ showAbout, logout }) => (
        <>
          <View style={styles.profileHeader}>
            <View style={styles.avatar} accessibilityRole="image" accessibilityLabel="Avatar ilustrativo do aluno">
              <Text style={styles.initials}>{getStudentInitials(data.student.displayName)}</Text>
            </View>
            <Text style={styles.name} accessibilityRole="header">{data.student.displayName}</Text>
            <View style={styles.role}><Text style={styles.roleText}>Aluno</Text></View>
            <Text style={styles.bio}>{data.student.bio || 'Adicione uma descrição ao seu perfil.'}</Text>
          </View>

          {saved && <Text style={styles.saved} accessibilityRole="alert" accessibilityLiveRegion="polite">Perfil demonstrativo atualizado. As alterações duram até você sair.</Text>}

          <View style={styles.summary}>
            <StudentSummaryCard icon="trophy-outline" value={summary.points} label="Pontos conquistados" />
            <StudentSummaryCard icon="book-outline" value={summary.activeCourses} label="Cursos em andamento" />
            <StudentSummaryCard icon="checkmark-circle-outline" value={summary.completedTasks} label="Tarefas concluídas" />
          </View>

          <View style={[styles.columns, wide && styles.wideColumns]}>
            <View style={[styles.column, wide && styles.wideColumn]}>
              <View style={styles.card}>
                <Text style={styles.sectionTitle} accessibilityRole="header">Informações pessoais</Text>
                {[
                  { label: 'Nome de exibição', value: data.student.displayName },
                  { label: 'Papel', value: 'Aluno' },
                  { label: 'Sobre mim', value: data.student.bio || 'Descrição ainda não informada.' },
                ].map((item) => (
                  <View key={item.label} style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                    <Text style={styles.infoValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
              <StudentActivityPreview data={data} />
            </View>
            <View style={[styles.column, wide && styles.wideColumn]}>
              <View style={styles.settings}>
                <Text style={styles.sectionTitle} accessibilityRole="header">Configurações</Text>
                <Pressable onPress={openEditor} accessibilityRole="button" accessibilityLabel="Editar perfil" style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}>
                  <Ionicons name="create-outline" size={22} color={colors.primary} accessible={false} />
                  <View style={styles.flex}><Text style={styles.settingTitle}>Editar perfil</Text><Text style={styles.settingDetail}>Nome e apresentação</Text></View>
                  <Ionicons name="chevron-forward-outline" size={18} color={colors.textMuted} accessible={false} />
                </Pressable>
                <Pressable onPress={showAbout} accessibilityRole="button" accessibilityLabel="Sobre o Educa+" style={({ pressed }) => [styles.settingRow, pressed && styles.pressed]}>
                  <Ionicons name="information-circle-outline" size={22} color={colors.primary} accessible={false} />
                  <View style={styles.flex}><Text style={styles.settingTitle}>Sobre o Educa+</Text><Text style={styles.settingDetail}>Conheça o projeto</Text></View>
                  <Ionicons name="chevron-forward-outline" size={18} color={colors.textMuted} accessible={false} />
                </Pressable>
                <Pressable onPress={logout} accessibilityRole="button" accessibilityLabel="Sair da demonstração" style={({ pressed }) => [styles.settingRow, styles.lastRow, pressed && styles.pressed]}>
                  <Ionicons name="log-out-outline" size={22} color={colors.error} accessible={false} />
                  <View style={styles.flex}><Text style={[styles.settingTitle, styles.exitText]}>Sair</Text><Text style={styles.settingDetail}>Descartar os dados desta sessão de teste</Text></View>
                </Pressable>
              </View>
              <Text style={styles.sessionNote}>Seus ajustes são locais e temporários. Esta demonstração não usa conta, token ou banco de dados.</Text>
            </View>
          </View>

          <StudentModal visible={editing} title="Editar perfil" onClose={() => setEditing(false)}>
            <Text style={styles.editorHint}>Personalize apenas esta demonstração. Nada será salvo no banco.</Text>
            <TextField label="Nome de exibição" value={displayName} onChangeText={setDisplayName} error={errors.displayName} maxLength={60} autoCapitalize="words" autoFocus returnKeyType="next" onSubmitEditing={() => bioRef.current?.focus()} />
            <TextField ref={bioRef} label="Descrição curta (opcional)" value={bio} onChangeText={setBio} error={errors.bio} maxLength={160} multiline numberOfLines={3} autoCapitalize="sentences" />
            <Text style={styles.counter}>{bio.length}/160 caracteres</Text>
            <View style={styles.editorActions}>
              <View style={styles.flex}><Button title="Cancelar" variant="secondary" onPress={() => setEditing(false)} /></View>
              <View style={styles.flex}><Button title="Salvar" accessibilityLabel="Salvar alterações do perfil" onPress={saveProfile} /></View>
            </View>
          </StudentModal>
        </>
      )}
    </StudentShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  profileHeader: { alignItems: 'center', gap: 10, paddingVertical: 8 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: `${colors.primary}12`, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  initials: { fontFamily: fonts.bold, fontSize: 30, color: colors.primary },
  name: { width: '100%', fontFamily: fonts.bold, fontSize: 25, lineHeight: 34, color: colors.text, textAlign: 'center' },
  role: { backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 5 },
  roleText: { fontFamily: fonts.semibold, fontSize: 11, color: colors.primary },
  bio: { maxWidth: 520, fontFamily: fonts.regular, fontSize: 14, lineHeight: 22, textAlign: 'center', color: colors.text },
  summary: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  saved: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 12, fontFamily: fonts.medium, fontSize: 12, lineHeight: 20, color: colors.primary },
  columns: { gap: 20 },
  wideColumns: { flexDirection: 'row', alignItems: 'flex-start' },
  column: { minWidth: 0, gap: 20 },
  wideColumn: { flex: 1 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 20, gap: 16 },
  sectionTitle: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 25, color: colors.text },
  infoRow: { gap: 5 },
  infoLabel: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 18, color: colors.textMuted },
  infoValue: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 22, color: colors.text },
  settings: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 20, gap: 8 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 72, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  lastRow: { borderBottomWidth: 0 },
  settingTitle: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 21, color: colors.text },
  settingDetail: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 18, color: colors.textMuted, marginTop: 3 },
  exitText: { color: colors.error },
  sessionNote: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 20, color: colors.text },
  editorHint: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 21, color: colors.textMuted },
  counter: { fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted, textAlign: 'right' },
  editorActions: { flexDirection: 'row', gap: 12 },
  pressed: { opacity: 0.75 },
});
