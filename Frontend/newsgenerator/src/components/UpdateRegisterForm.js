const RegisterNotationForm = ({
  onUpdate,
  editingNotation,
  setEditingNotation,
  setIsEditing,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
        <h3 className="text-lg font-bold mb-4 text-center">수정하기</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onUpdate(editingNotation);
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              대상 단어
            </label>
            <input
              type="text"
              value={editingNotation.target_word}
              onChange={(e) =>
                setEditingNotation({
                  ...editingNotation,
                  target_word: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              품사
            </label>
            <input
              type="text"
              value={editingNotation.pos}
              onChange={(e) =>
                setEditingNotation({
                  ...editingNotation,
                  pos: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              대체 단어
            </label>
            <input
              type="text"
              value={editingNotation.replacement_word}
              onChange={(e) =>
                setEditingNotation({
                  ...editingNotation,
                  replacement_word: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingNotation(null);
              }}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterNotationForm;
