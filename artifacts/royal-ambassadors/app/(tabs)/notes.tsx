import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { StudyNote, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function NotesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { studyNotes, saveStudyNote, removeStudyNote } = useApp();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 118 : insets.bottom + 92;

  const openNewNote = () => {
    setEditingId(undefined);
    setTitle("");
    setContent("");
    setEditorOpen(true);
  };

  const openNote = (note: StudyNote) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingId(undefined);
    setTitle("");
    setContent("");
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle && !trimmedContent) return;

    saveStudyNote({
      id: editingId,
      title: trimmedTitle || "Untitled note",
      content: trimmedContent,
    });
    closeEditor();
  };

  const confirmDelete = () => {
    if (!editingId) return;
    const deleteNote = () => {
      removeStudyNote(editingId);
      closeEditor();
    };

    if (Platform.OS === "web") {
      if (window.confirm("Delete this note? This can’t be undone.")) {
        deleteNote();
      }
      return;
    }

    Alert.alert("Delete note?", "This can’t be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: deleteNote },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPadding + 12,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={editorOpen ? closeEditor : () => router.back()}
          hitSlop={10}
          style={styles.headerBack}
          accessibilityRole="button"
          accessibilityLabel={editorOpen ? "Back to notes" : "Back to tools"}
        >
          <Feather name="arrow-left" size={21} color={colors.navy} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.navy }]}>
          {editorOpen ? (editingId ? "Edit note" : "New note") : "My Notes"}
        </Text>
        {editorOpen ? (
          <Pressable
            onPress={handleSave}
            disabled={!title.trim() && !content.trim()}
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: colors.primary },
              (!title.trim() && !content.trim() || pressed) && styles.saveButtonMuted,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Save note"
          >
            <Text style={[styles.saveButtonText, { color: colors.primaryForeground }]}>
              Save
            </Text>
          </Pressable>
        ) : (
          <View style={styles.headerRightSpacer} />
        )}
      </View>

      {editorOpen ? (
        <KeyboardAwareScrollViewCompat
          style={styles.flex}
          contentContainerStyle={[
            styles.editorContent,
            { paddingBottom: insets.bottom + 28 },
          ]}
          bottomOffset={20}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.editorIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="edit-3" size={19} color={colors.primary} />
          </View>
          <Text style={[styles.editorEyebrow, { color: colors.primary }]}>
            PERSONAL STUDY NOTE
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Give your note a title"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.titleInput, { color: colors.navy, borderBottomColor: colors.border }]}
            accessibilityLabel="Note title"
            returnKeyType="next"
            maxLength={100}
          />
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Write your thoughts, questions, or reflections..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.contentInput, { color: colors.navy }]}
            accessibilityLabel="Note content"
            multiline
            textAlignVertical="top"
            maxLength={12000}
          />
          <View style={[styles.localNote, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="lock" size={15} color={colors.mutedForeground} />
            <Text style={[styles.localNoteText, { color: colors.mutedForeground }]}>
              Your notes are saved on this device.
            </Text>
          </View>
          {editingId ? (
            <Pressable
              onPress={confirmDelete}
              style={styles.deleteButton}
              accessibilityRole="button"
              accessibilityLabel="Delete note"
            >
              <Feather name="trash-2" size={16} color={colors.destructive} />
              <Text style={[styles.deleteButtonText, { color: colors.destructive }]}>
                Delete note
              </Text>
            </Pressable>
          ) : null}
        </KeyboardAwareScrollViewCompat>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.listIntro}>
            <Text style={[styles.listEyebrow, { color: colors.primary }]}>
              YOUR REFLECTIONS
            </Text>
            <Text style={[styles.listTitle, { color: colors.navy }]}>
              Keep what speaks to you.
            </Text>
            <Text style={[styles.listDescription, { color: colors.mutedForeground }]}>
              Save questions, reflections, and lessons from your study.
            </Text>
          </View>

          <Pressable
            onPress={openNewNote}
            style={({ pressed }) => [
              styles.newNoteButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Create a new note"
          >
            <Feather name="plus" size={19} color={colors.primaryForeground} />
            <Text style={[styles.newNoteText, { color: colors.primaryForeground }]}>
              New note
            </Text>
          </Pressable>

          {studyNotes.length === 0 ? (
            <View
              style={[
                styles.emptyState,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="feather" size={24} color={colors.primary} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.navy }]}>
                Start with one thought
              </Text>
              <Text style={[styles.emptyDescription, { color: colors.mutedForeground }]}>
                Your notes will be kept here so you can return to them anytime.
              </Text>
            </View>
          ) : (
            <View style={styles.noteList}>
              {studyNotes.map((note) => (
                <Pressable
                  key={note.id}
                  onPress={() => openNote(note)}
                  style={({ pressed }) => [
                    styles.noteCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      opacity: pressed ? 0.84 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit note: ${note.title}`}
                >
                  <View style={styles.noteCardTop}>
                    <Text style={[styles.noteDate, { color: colors.mutedForeground }]}>
                      {new Date(note.updatedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                    <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
                  </View>
                  <Text style={[styles.noteTitle, { color: colors.navy }]} numberOfLines={1}>
                    {note.title}
                  </Text>
                  {note.content ? (
                    <Text
                      style={[styles.notePreview, { color: colors.mutedForeground }]}
                      numberOfLines={3}
                    >
                      {note.content}
                    </Text>
                  ) : null}
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 13,
    borderBottomWidth: 1,
  },
  headerBack: {
    width: 38,
    height: 36,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  headerRightSpacer: { width: 38 },
  saveButton: {
    minWidth: 58,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  saveButtonMuted: { opacity: 0.55 },
  saveButtonText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  listContent: { paddingHorizontal: 20, paddingTop: 28 },
  listIntro: { marginBottom: 21 },
  listEyebrow: {
    fontSize: 11,
    letterSpacing: 1.4,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 24,
    lineHeight: 31,
    fontFamily: "Inter_700Bold",
    marginBottom: 7,
  },
  listDescription: { fontSize: 14, lineHeight: 21, fontFamily: "Inter_400Regular" },
  newNoteButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    borderRadius: 15,
    marginBottom: 18,
  },
  newNoteText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  emptyState: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 7 },
  emptyDescription: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  noteList: { gap: 12 },
  noteCard: { borderWidth: 1, borderRadius: 16, padding: 16 },
  noteCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  noteDate: { fontSize: 11, fontFamily: "Inter_500Medium" },
  noteTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 6 },
  notePreview: { fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular" },
  editorContent: { paddingHorizontal: 22, paddingTop: 22 },
  editorIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  editorEyebrow: {
    fontSize: 10,
    letterSpacing: 1.3,
    fontFamily: "Inter_700Bold",
    marginBottom: 7,
  },
  titleInput: {
    fontSize: 22,
    lineHeight: 29,
    fontFamily: "Inter_700Bold",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  contentInput: {
    minHeight: 280,
    fontSize: 15,
    lineHeight: 23,
    fontFamily: "Inter_400Regular",
    paddingTop: 16,
    paddingBottom: 16,
  },
  localNote: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  localNoteText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 8,
    marginTop: 28,
    padding: 12,
  },
  deleteButtonText: { fontSize: 13, fontFamily: "Inter_700Bold" },
});
