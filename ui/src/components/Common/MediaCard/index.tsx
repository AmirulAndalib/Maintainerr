import React, { memo, useEffect, useState } from 'react'
import Spinner from '../../../assets/spinner.svg'
import Transition from '../Transition'
import { useIsTouch } from '../../../hooks/useIsTouch'
import CachedImage from '../CachedImage'
import GetApiHandler from '../../../utils/ApiHandler'
import Button from '../Button'
import AddModal from '../../AddModal'
import MediaModalContent from './MediaModal'
import { DocumentAddIcon, DocumentRemoveIcon } from '@heroicons/react/solid'
import RemoveFromCollectionBtn from '../../Collection/CollectionDetail/RemoveFromCollectionBtn'

interface IMediaCard {
  id: number
  image?: string
  summary?: string
  year?: string
  mediaType: 'movie' | 'show' | 'season' | 'episode'
  title: string
  userScore: number
  canExpand?: boolean
  inProgress?: boolean
  tmdbid?: string
  libraryId?: number
  type?: 1 | 2 | 3 | 4
  collectionPage: boolean
  daysLeft?: number
  exclusionId?: number
  exclusionType?: 'global' | 'specific' | undefined
  collectionId?: number
  isManual?: boolean
  onRemove?: (id: string) => void
}

const MediaCard: React.FC<IMediaCard> = ({
  id,
  summary,
  year,
  mediaType,
  title,
  libraryId,
  type,
  collectionId = 0,
  daysLeft = 9999,
  exclusionId = undefined,
  tmdbid = undefined,
  userScore,
  canExpand = false,
  collectionPage = false,
  exclusionType = undefined,
  isManual = false,
  onRemove = (id: string) => {},
}) => {
  const isTouch = useIsTouch()
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [excludeModal, setExcludeModal] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [hasExclusion, setHasExclusion] = useState(false)
  const [showMediaModal, setShowMediaModal] = useState(false)

  const openMediaModal = () => {
    setShowMediaModal(true)
  }

  const closeMediaModal = () => setShowMediaModal(false)

  useEffect(() => {
    if (tmdbid) {
      GetApiHandler(`/moviedb/image/${mediaType}/${tmdbid}`).then(setImage)
    }

    if (!collectionPage) {
      GetApiHandler(`/rules/exclusion?plexId=${id}`).then((resp: []) =>
        setHasExclusion(resp.length > 0),
      )
    }
  }, [tmdbid, id, collectionPage])

  const [libraryMap, setLibraryMap] = useState<Record<number, string>>({})

  useEffect(() => {
    GetApiHandler('/plex/libraries').then(
      (libraries: { key: string; title: string }[]) => {
        if (!libraries || !Array.isArray(libraries)) return

        // Convert librarySectionID (key) to integer before storing it
        const libraryMapping = libraries.reduce<Record<number, string>>(
          (acc, library) => {
            acc[parseInt(library.key, 10)] = library.title
            return acc
          },
          {},
        )

        setLibraryMap(libraryMapping)
      },
    )
  }, [])

  const isLibraryMapReady = Object.keys(libraryMap).length > 0

  const libraryTitle = React.useMemo(() => {
    if (!isLibraryMapReady || typeof libraryId !== 'number') return ''
    return libraryMap[libraryId] ?? 'Unknown Library'
  }, [isLibraryMapReady, libraryId, libraryMap])

  // Just to get the year from the date
  if (year && mediaType !== 'episode') {
    year = year.slice(0, 4)
  }

  return (
    <div className={'w-full'}>
      {excludeModal ? (
        <AddModal
          plexId={id}
          {...(libraryId ? { libraryId: libraryId } : {})}
          {...(type ? { type: type } : {})}
          onSubmit={() => {
            setExcludeModal(false)
          }}
          onCancel={() => setExcludeModal(false)}
          modalType="exclude"
        />
      ) : undefined}

      {addModal ? (
        <AddModal
          plexId={id}
          {...(libraryId ? { libraryId: libraryId } : {})}
          {...(type ? { type: type } : {})}
          onSubmit={() => {
            setAddModal(false)
          }}
          onCancel={() => setAddModal(false)}
          modalType="add"
        />
      ) : undefined}
      <div
        className={`relative transform-gpu cursor-default overflow-hidden rounded-xl bg-zinc-800 bg-cover pb-[150%] outline-none ring-1 transition duration-300 ${
          showDetail
            ? 'scale-105 shadow-lg ring-zinc-500'
            : 'scale-100 shadow ring-zinc-700'
        }`}
        onMouseEnter={() => !isTouch && setShowDetail(true)}
        onMouseLeave={() => setShowDetail(false)}
        onClick={() => showDetail && openMediaModal()}
        role="link"
        tabIndex={0}
      >
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          {image ? (
            <CachedImage
              className="absolute inset-0 h-full w-full"
              alt=""
              src={`https://image.tmdb.org/t/p/w300_and_h450_face${image}`}
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : undefined}
          <div className="absolute left-0 right-0 flex items-center justify-between p-2">
            <div
              className={`pointer-events-none z-40 rounded-full shadow ${
                mediaType === 'movie'
                  ? 'bg-zinc-900'
                  : mediaType === 'show'
                    ? 'bg-amber-900'
                    : mediaType === 'season'
                      ? 'bg-yellow-700'
                      : 'bg-rose-900'
              }`}
            >
              <div className="flex h-4 items-center px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-zinc-200 sm:h-5">
                {mediaType}
              </div>
            </div>
          </div>
          {hasExclusion && !collectionPage ? (
            <div className="absolute right-0 flex items-center justify-between p-2">
              <div
                className={`pointer-events-none z-40 rounded-full shadow ${
                  mediaType === 'movie'
                    ? 'bg-zinc-900'
                    : mediaType === 'show'
                      ? 'bg-amber-900'
                      : mediaType === 'season'
                        ? 'bg-yellow-700'
                        : 'bg-rose-900'
                }`}
              >
                <div className="flex h-4 items-center px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-zinc-200 sm:h-5">
                  {'EXCL'}
                </div>
              </div>
            </div>
          ) : undefined}

          {/* on collection page and for manually added */}
          {collectionPage && isManual && !showDetail ? (
            <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 transform items-center justify-between p-2">
              <div
                className={`pointer-events-none z-40 rounded-full shadow ${
                  mediaType === 'movie'
                    ? 'bg-zinc-900'
                    : mediaType === 'show'
                      ? 'bg-amber-900'
                      : mediaType === 'season'
                        ? 'bg-yellow-700'
                        : 'bg-rose-900'
                }`}
              >
                <div className="flex h-4 items-center px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-zinc-200 sm:h-5">
                  {'MANUAL'}
                </div>
              </div>
            </div>
          ) : undefined}

          {/* on collection page and for the media items */}
          {collectionPage && !exclusionType && daysLeft !== 9999 ? (
            <div className="absolute right-0 flex items-center justify-between p-2">
              <div
                className={`pointer-events-none z-40 rounded-full shadow ${
                  daysLeft < 0
                    ? 'bg-red-700'
                    : mediaType === 'movie'
                      ? 'bg-zinc-900'
                      : mediaType === 'show'
                        ? 'bg-amber-900'
                        : mediaType === 'season'
                          ? 'bg-yellow-700'
                          : 'bg-rose-900'
                } `}
              >
                <div className="flex h-4 items-center px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-zinc-200 sm:h-5">
                  {daysLeft}
                </div>
              </div>
            </div>
          ) : undefined}

          {/* on collection page and for the exclusions */}
          {collectionPage && exclusionType === 'global' ? (
            <div className="absolute right-0 flex items-center justify-between p-2">
              <div
                className={`pointer-events-none z-40 rounded-full shadow ${
                  mediaType === 'movie'
                    ? 'bg-zinc-900'
                    : mediaType === 'show'
                      ? 'bg-amber-900'
                      : mediaType === 'season'
                        ? 'bg-yellow-700'
                        : 'bg-rose-900'
                }`}
              >
                <div className="flex h-4 items-center px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-zinc-200 sm:h-5">
                  {exclusionType.toUpperCase()}
                </div>
              </div>
            </div>
          ) : undefined}

          <Transition
            show={isUpdating}
            enter="transition ease-in-out duration-300 transform opacity-0"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in-out duration-300 transform opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 z-40 flex items-center justify-center rounded-xl bg-zinc-800 bg-opacity-60 text-zinc-200">
              <CachedImage
                priority
                src={Spinner}
                className="h-10 w-10"
                alt=""
              />
            </div>
          </Transition>

          <Transition
            show={!image || showDetail}
            enter="transition transform opacity-0"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition transform opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 cursor-alias overflow-hidden rounded-xl">
              <div
                className="absolute inset-0 h-full w-full overflow-hidden text-left"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(30, 40, 55, 0.65) 0%, rgba(30, 40, 55, 1) 100%)',
                }}
              >
                <div className="flex h-full w-full items-end">
                  <div className={`w-full px-2 pb-1 text-zinc-200`}>
                    {year && <div className="text-sm font-medium">{year}</div>}

                    <h1
                      className="w-full whitespace-normal text-sm font-bold leading-tight"
                      style={{
                        WebkitLineClamp: 3,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        wordBreak: 'break-word',
                      }}
                    >
                      {title}
                    </h1>
                    <hr className="mt-1"></hr>
                    <div
                      className="mt-1 flex h-4 text-xs"
                      style={{
                        WebkitLineClamp: 5,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        wordBreak: 'break-word',
                      }}
                    >
                      {libraryTitle && (
                        <span className="whitespace-normal text-white">
                          <span className="font-semibold">Library: </span>
                          {libraryTitle}
                        </span>
                      )}
                    </div>
                    {!collectionPage ? (
                      <div>
                        <Button
                          buttonType="twin-primary-l"
                          buttonSize="md"
                          className="mb-1 mt-2 h-6 w-1/2 text-zinc-200 shadow-md"
                          onClick={(e) => {
                            e.stopPropagation() // Stops the MediaModal from also showing when clicked.
                            setAddModal(true)
                          }}
                        >
                          {<DocumentAddIcon className="m-auto ml-3 h-3" />}{' '}
                          <p className="rules-button-text m-auto mr-2">
                            {'Add'}
                          </p>
                        </Button>
                        <Button
                          buttonSize="md"
                          buttonType="twin-primary-r"
                          className="mt-2 h-6 w-1/2"
                          onClick={(e) => {
                            e.stopPropagation() // Stops the MediaModal from also showing when clicked.
                            setExcludeModal(true)
                          }}
                        >
                          {<DocumentRemoveIcon className="m-auto ml-3 h-3" />}{' '}
                          <p className="rules-button-text m-auto mr-2">
                            {'Excl'}
                          </p>
                        </Button>
                      </div>
                    ) : (
                      <RemoveFromCollectionBtn
                        plexId={id}
                        popup={exclusionType && exclusionType === 'global'}
                        onRemove={() => onRemove(id.toString())}
                        collectionId={collectionId}
                        exclusionId={exclusionId}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
      {!addModal && !excludeModal && showMediaModal && (
        <MediaModalContent
          id={id}
          onClose={closeMediaModal}
          title={title}
          summary={summary || 'No description available.'}
          mediaType={mediaType}
          tmdbid={tmdbid}
          year={year}
          userScore={userScore}
        />
      )}
    </div>
  )
}
const propsEqual = (prev: IMediaCard, next: IMediaCard) => prev.id === next.id

export default memo(MediaCard, propsEqual)
